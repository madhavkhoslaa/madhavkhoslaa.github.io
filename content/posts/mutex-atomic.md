---
title: "Writing a Mutex in C: Atomics and x86"
date: 2026-09-20T12:00:00+05:30
draft: false
description: "Writing a spin mutex with C11 atomics, testing it with 16 threads, and looking at the x86-64 assembly."
tags: [C, Atomics, Mutex, x86, Assembly]
---

## Mutex, What is it?

### Example 1

Imagine two people updating the same number on a whiteboard. The number is 0
and both have to increment it by 1.

The answer should be 2. But what if both read 0 before either writes anything?
Both calculate 1. Both write 1.

So the important thing is not just how we increment the number. It is **who
gets to update it right now**.

A mutex gives one thread ownership of a critical section. Everyone else has to
wait. In C, accessing a shared ordinary counter this way without synchronization
is a data race, which is undefined behavior. The whiteboard example explains
the problem; it is not a prediction of what a racy C program will do.

We are going to write a **spin mutex**. Waiting threads keep checking the lock
instead of going to sleep. No futex. Just C atomics and an x86 instruction.

### Example 2 | pthread_create updates a value alone

Before we lock anything, here is the smallest pthread program: one worker
thread updates an ordinary `uint64_t`. No mutex yet.

```c
#include <inttypes.h>
#include <pthread.h>
#include <stdint.h>
#include <stdio.h>

static void *add_one(void *arg)
{
    uint64_t *value = arg; /* The worker updates the caller's value. */
    *value += 1;
    return NULL;
}

int main(void)
{
    uint64_t value = 0;
    pthread_t thread;

    if (pthread_create(&thread, NULL, add_one, &value) != 0) {
        perror("pthread_create");
        return 1;
    }
    pthread_join(thread, NULL); /* Wait for the worker to finish. */

    printf("value: %" PRIu64 "\n", value);
    return 0;
}
```

`pthread_create` takes four arguments: the `pthread_t` to fill in, attributes
(`NULL` means defaults), the function to run in the new thread, and the single
argument passed to that function. Here the argument is `&value`, so `add_one`
updates the same `uint64_t` that `main` owns.

`pthread_join` blocks until the worker thread has finished. After it returns,
`main` can safely read `value`.

Only one thread ever touches `value`, so this is not a data race and no lock is
needed. The race appears when several threads update the same value at once,
which is exactly the whiteboard example above. The mutex we are about to write
will protect those concurrent updates.

## How do we represent ownership? | Let's talk Code.

This.

```c
#include <stdbool.h>
#include <stdatomic.h>
#include <immintrin.h>

_Static_assert(ATOMIC_INT_LOCK_FREE == 2,
               "Requires lock-free unsigned int atomics");

typedef struct {
    atomic_uint state;
} spin_mutex;

#define SPIN_MUTEX_INITIALIZER { .state = 0u }
```

Two states:

1. `0`: nobody owns the mutex.
2. `1`: somebody owns the mutex.

The static assertion checks that these integer atomics are always lock-free on
our target. That does not make our mutex a lock-free algorithm. A thread can
still wait indefinitely for the owner!

Initialize the mutex before sharing it between threads.

## Why not check for 0 and then write 1?

Because two threads could both see 0 before either writes 1. We have recreated
the whiteboard problem, except now the number is our lock.

We need one **atomic operation** that writes 1 and tells us what was there
before. That is what `atomic_exchange_explicit` does.

```c
void spin_mutex_lock(spin_mutex *m)
{
    while (atomic_exchange_explicit(&m->state, 1u, memory_order_acquire)) {
        while (atomic_load_explicit(&m->state, memory_order_relaxed))
            _mm_pause();
    }
}
```

If the exchange returns 0, we acquired the mutex. The outer loop ends.

If it returns 1, somebody already owns it. We enter the inner loop and wait.

An obvious question here is: why do we need **two loops**?

### The inner loop

Repeatedly exchanging would keep requesting exclusive ownership of the cache
line containing `state`. Imagine everyone repeatedly grabbing the same sign to
check whether it says occupied.

Instead, the inner loop just reads. Waiting cores can share the cache line
until an update invalidates their copies. This pattern is called
*test-and-test-and-set*.

When a load sees 0, we try the exchange again. Seeing 0 is not ownership.
Somebody else might get there first.

And `_mm_pause()`? It emits x86 `PAUSE`, a hint that we are in a spin loop. It
can reduce spin-loop penalties and pressure on a sibling hardware thread. It
does not put our thread to sleep, and it is not a memory fence.

## What are acquire and release doing here?

Let's first look at unlocking.

```c
void spin_mutex_unlock(spin_mutex *m)
{
    atomic_store_explicit(&m->state, 0u, memory_order_release);
}
```

Setting the state to 0 makes the mutex available. But ownership is only half
the problem. The next owner also needs to see the previous owner's work.

```text
Thread A: acquire => update protected data => release
                                                |
Thread B:                  acquire reads that 0 => read protected data
```

The release store and the successful acquire exchange establish a
*happens-before* relationship. Thread A's protected writes become visible to
Thread B after it acquires the mutex.

The inner polling loop uses `memory_order_relaxed` because it only decides
when to retry. We do not access protected data until the exchange succeeds.

So yes, the data inside the critical section can be ordinary, non-atomic data.
Every concurrent access to it must follow the same locking discipline.
`volatile` is not a replacement for this.

## What if I do not want to wait?

Use `trylock`.

```c
bool spin_mutex_trylock(spin_mutex *m)
{
    unsigned expected = 0u;
    return atomic_compare_exchange_strong_explicit(
        &m->state, &expected, 1u,
        memory_order_acquire, memory_order_relaxed);
}
```

Compare the state with 0. If it matches, atomically replace it with 1 and return
`true`. Otherwise return `false`. No waiting loop.

## Using our mutex | Let's create 16 threads.

Let's go back to the whiteboard example. This time we have 16 threads, each
adding 5 to the same total 100,000 times.

What should the final value be?

```text
16 threads x 100,000 additions x 5 = 8,000,000
```

The mutex implementation is in [`mutex.c`](https://github.com/madhavkhoslaa/mutex-atomic/blob/master/mutex.c).
Put the following example in [`main.c`](https://github.com/madhavkhoslaa/mutex-atomic/blob/master/main.c),
next to it. We include `mutex.c` directly so this small example needs no
separate header. Compile `main.c` alone: the include already brings in the
mutex implementation.

```c
#include <inttypes.h>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* Include the implementation once; compile main.c on its own. */
#include "mutex.c"

enum {
    THREAD_COUNT = 16,
    ADDITIONS_PER_THREAD = 100000,
    VALUE_PER_ADDITION = 5
};

static spin_mutex mutex = SPIN_MUTEX_INITIALIZER;
static atomic_bool start = false;
static uint64_t total = 0; /* Ordinary data, protected by the mutex. */

static void *add_value(void *arg)
{
    (void)arg;

    /* Wait until main has created all worker threads. */
    while (!atomic_load_explicit(&start, memory_order_acquire))
        _mm_pause();

    for (unsigned i = 0; i < ADDITIONS_PER_THREAD; ++i) {
        spin_mutex_lock(&mutex);
        total += VALUE_PER_ADDITION; /* The addition is inside the mutex. */
        spin_mutex_unlock(&mutex);
    }
    return NULL;
}

static void check_pthread(int error)
{
    if (error != 0) {
        fprintf(stderr, "pthread: %s\n", strerror(error));
        exit(EXIT_FAILURE);
    }
}

int main(void)
{
    pthread_t threads[THREAD_COUNT];

    for (unsigned i = 0; i < THREAD_COUNT; ++i)
        check_pthread(pthread_create(&threads[i], NULL, add_value, NULL));

    atomic_store_explicit(&start, true, memory_order_release);

    for (unsigned i = 0; i < THREAD_COUNT; ++i)
        check_pthread(pthread_join(threads[i], NULL));

    const uint64_t expected =
        (uint64_t)THREAD_COUNT * ADDITIONS_PER_THREAD * VALUE_PER_ADDITION;

    /* All workers have finished, so these reads need no lock. */
    printf("Threads: %d\n", THREAD_COUNT);
    printf("Additions per thread: %d\n", ADDITIONS_PER_THREAD);
    printf("Value per addition: %d\n", VALUE_PER_ADDITION);
    printf("Expected: %" PRIu64 "\n", expected);
    printf("Actual:   %" PRIu64 "\n", total);
    printf("Result: %s\n", total == expected ? "PASS" : "FAIL");

    return total == expected ? EXIT_SUCCESS : EXIT_FAILURE;
}
```

Notice where `total += VALUE_PER_ADDITION` is. **Between lock and unlock.**
The read, addition, and write all belong inside the critical section. Locking
only around the final write would not protect the whole operation.

`total` is an ordinary integer. The mutex protects it. The separate atomic
`start` flag holds workers until all threads have been created; it does not
protect the addition.

We use pthreads to create and join threads. The lock itself still uses our C
atomics and x86 `PAUSE`. Once every `pthread_join` has returned successfully,
the workers are finished and main can read the total without taking the lock.

### Compile and run

The complete example is in [mutex-atomic](https://github.com/madhavkhoslaa/mutex-atomic).
Clone it and run:

```sh
git clone https://github.com/madhavkhoslaa/mutex-atomic.git
cd mutex-atomic
gcc -std=c11 -O2 -Wall -Wextra -Wpedantic -Werror main.c -pthread -o mutex-demo
./mutex-demo
```

### Output

```text
Threads: 16
Additions per thread: 100000
Value per addition: 5
Expected: 8000000
Actual:   8000000
Result: PASS
```

The program also returns a failure exit status if the total does not match.

## What did the compiler actually generate? [ASSEMBLY AHEAD!]

Run these commands from the directory containing `mutex.c`:

```sh
gcc -std=c11 -O2 -Wall -Wextra -Wpedantic -Werror -c mutex.c -o mutex.o
objdump -d -Mintel mutex.o > mutex.asm
```

We use `-c` because this file provides the mutex functions, not a `main()`.

### Output

This is the actual GCC 16.2.1 (`20260810`) output on Linux/x86-64, shown in
Intel syntax. I have omitted instruction bytes and alignment NOPs here.
The commands above write the complete dump to `mutex.asm`. The mutex pointer
is in `rdi`.

```asm
0000000000000000 <spin_mutex_lock>:
   0: mov    eax,0x1
   5: xchg   DWORD PTR [rdi],eax
   7: test   eax,eax
   9: je     20 <spin_mutex_lock+0x20>
  10: mov    eax,DWORD PTR [rdi]
  12: test   eax,eax
  14: je     0 <spin_mutex_lock>
  16: pause
  18: jmp    10 <spin_mutex_lock+0x10>
  20: ret

0000000000000030 <spin_mutex_trylock>:
  30: xor    eax,eax
  32: mov    edx,0x1
  37: lock cmpxchg DWORD PTR [rdi],edx
  3b: sete   al
  3e: ret

0000000000000040 <spin_mutex_unlock>:
  40: mov    DWORD PTR [rdi],0x0
  46: ret
```

### Where is the lock prefix on xchg?

Memory `xchg` is implicitly locked. So `xchg [rdi], eax` already performs an
atomic exchange. It puts 1 into the state and the old state into `eax`.
`test eax, eax` checks whether we got 0.

The inner C loop became `mov`, `test`, a branch, and `pause`.

For `trylock`, we get `lock cmpxchg`. It compares memory with the expected zero
in `eax`. `sete al` turns the comparison result into our boolean return value.

### Unlock is just a mov?

Yes!

For a naturally aligned atomic integer in ordinary write-back RAM, x86 already
provides the hardware ordering needed for this release store. The C atomic
operation also constrains compiler reordering. No `mfence` is needed here.

This does not mean we can replace the C atomic with an ordinary assignment.
We still need the C memory-model guarantees. It also does not extend this
argument to MMIO or non-temporal stores.

## One last thing about spinning

If the owner gets descheduled, everyone else keeps waiting and consuming CPU.
Keep the critical section short. This mutex is non-recursive, must be unlocked
by its owner, and does not guarantee fairness. Keep the object naturally
aligned and do not copy it while it is in use.

The `main.c` example above passed both an optimized GCC build and a
ThreadSanitizer build. In each run, 16 threads completed 1,600,000 protected
additions and produced exactly 8,000,000. ThreadSanitizer reported no data
races.

To run the same check:

```sh
gcc -std=c11 -O1 -g -fsanitize=thread main.c -pthread -o mutex-demo-tsan
./mutex-demo-tsan
```

The tests are useful evidence. The atomic exchange and acquire/release
relationship are why the mutex works.

## Sources

- [C atomic exchange](https://en.cppreference.com/w/c/atomic/atomic_exchange)
- [C memory ordering](https://en.cppreference.com/w/c/atomic/memory_order)
- [x86 XCHG instruction reference](https://www.felixcloutier.com/x86/xchg)
- [x86 PAUSE instruction reference](https://www.felixcloutier.com/x86/pause)
