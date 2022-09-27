---
title: "Functional Programming in Rust 1: Closures"
date: 2022-09-27T02:01:58+05:30
draft: false
description: "It is a Programming Paradigm where you use functions to solve what you are building. The most common features that you might have used FP in any language will be Map and Reduce. Where you pass in a function what iterates in the collection you run map or reduce on."
tags:
  [
    Rust,
    C++,
    Functional Programming,
    Closures,
    Traits,
    Ferris,
    Blazingly Fast
  ]
---
![image](https://i.imgur.com/y0nqC0G.jpg)


# What is Functional Programming?

It is a Programming Paradigm where you use functions to solve what you are building. The most common features that you might have used FP in any language will be Map and Reduce.
Where you pass in a function what iterates in the collection you run map or reduce on.

Rust has some functional features too that I plan to write here.

# Closures

Let's do a quick Google search "closures"; The first result that comes to me is from MDN.

Let's see what MDN has to say(even though it is JS).

`A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function's scope from an inner function.`

## What information can we take from this statement?
1. It is a function that is inside a function
2. The inner function shares the same environment as the outer function.

## What information we can conclude from this statement?
1. The variables defined in the outer function are accessible in the inner function.

There is a lot of information that is left here in the context of rust, but hold on for a while :D

# Syntax for closure in Rust.

Take a look carefully at how you can create closures in rust. 

1. You give no type signatures for the formal arguments.
```rust
let a = |arg| arg + 1;
```
2. You give no return type signatures for the closure.

```rust
let a = |arg: u8| arg + 1;
```
3. You give types for the formal arguments and the return signatures.
```rust
let a = |arg: u8| -> u8 {arg + 1} 
```

So closures in rust are kind of "Pythonic" in a way where you can choose to give function type signatures, Right? Yes, but to an extent. Look at this example

## Playing with Closures !!!!
```rust
fn main() {
    let example = |arg| arg + 10;
    //  ^ This closure has no types for the arg, it just adds 10 to any type that supports addition(We can assume the minimum requirement of the type here)
    let x: usize = 10;
    let y: u8 = 11;
    example(x);
    // Called with type "usize"
    example(y);
    // Called with type "u8"
}
```
You might expect this program to compile correctly and on runtime to print 21 and 21. 

But we received a compile error.

Output
```
error[E0308]: mismatched types
  --> src/main.rs:10:13
   |
10 |     example(y);
   |     ------- ^ expected `usize`, found `u8`
   |     |
   |     arguments to this function are incorrect
   |
note: closure defined here
  --> src/main.rs:6:19
   |
6  |     let example = |arg| arg + 10;
   |                   ^^^^^
help: you can convert a `u8` to a `usize`
   |
10 |     example(y.into());
   |              +++++++

For more information about this error, try `rustc --explain E0308`.
error: could not compile `playground` due to previous error
```
When we dissect the error(Rust has the best errors btw) we see that on the second time the compiler says that "expected `usize` found `u8`" and then gives a suggestion.

So we learn that closure takes the first arguments type and return type as the type signature of the closure.


## Playing with closures(again)

```rust
fn main() {
    let b = 1;
    // defined in function main
    let a = |c: u8| -> u8 {c + b};
    // closure a uses b to add to the argument
    let z = a(1);
    // Result is assigned to z.
    println!("{}",z);
}
```
Output
```
2
```
We can observe here that variable b is accessible inside of closure a, so we can conclude that a closure shares the same scope as the parent.
## Phew, a lot of stuff to learn. Let's break down what I wrote down
1. Closures are functions that are inside a function and hence share the same scope as the parent function.
2. They are "Pythonic" in a way that they do not need type signatures but instead the compiler gives it a signature based on the type of arguments on the first call.

# Moving values inside closures.

If you're reading this blog I expect you to know what a move in rust is. If you don't you can read [this](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html).

So there are three ways of moving values into closues.

1. Immutable immutable
2. Mutable argument
3. Borrowing

## Example of Immutable arguments
```rust
fn main() {
    let list = vec![1, 2, 3];
    let only_borrows = |list| println!("From closure: {:?}", list);
    println!("Before calling closure: {:?}", list);
    only_borrows(list);
    println!("After calling closure: {:?}", list);
}
```
Output 

```
   Compiling playground v0.0.1 (/playground)
error[E0382]: borrow of moved value: `list`
 --> src/main.rs:8:45
  |
2 |     let list = vec![1, 2, 3];
  |         ---- move occurs because `list` has type `Vec<i32>`, which does not implement the `Copy` trait
...
7 |     only_borrows(list);
  |                  ---- value moved here
8 |     println!("After calling closure: {:?}", list);
  |                                             ^^^^ value borrowed here after move
  |
  = note: this error originates in the macro `$crate::format_args_nl` which comes from the expansion of the macro `println` (in Nightly builds, run with -Z macro-backtrace for more info)

For more information about this error, try `rustc --explain E0382`.
error: could not compile `playground` due to previous error

```


## Example of Mutable arguments
```rust
fn main() {
    let mut list = vec![1, 2, 3];
    let only_borrows = |mut list: Vec<u8>| {
    list.push(4);
    println!("From closure: {:?}", list );
    list
    };
    println!("Before calling closure: {:?}", list);
    list = only_borrows(list);
    println!("After calling closure: {:?}", list);
}
```
Output 

```
Before calling closure: [1, 2, 3]
From closure: [1, 2, 3, 4]
After calling closure: [1, 2, 3, 4]
```



## Example of borrowing
```rust
fn main() {
    let mut list: Vec<u8> = vec![1, 2, 3];

    let only_borrows = |list: &mut Vec<u8>| {
    list.push(4);
    println!("From closure: {:?}", list );
    };
    println!("Before calling closure: {:?}", list);
    only_borrows(&mut list);
    println!("After calling closure: {:?}", list);
}
```

Output

```
Before calling closure: [1, 2, 3]
From closure: [1, 2, 3, 4]
After calling closure: [1, 2, 3, 4]
```



# Moving captured values out of fn traits

So, once a value or a reference has been passed to the closure, The closure decides what happens with it.
It could use the value once and drop it, mutate the value or can take references to a value and do all of these.

Why do we have to do this?
Since Rust has this philosophy of all errors being compiled time errors and not runtime errors, we need to know how the values are being handled inside the closure so that in the runtime we do not get any UBs.

This defines three types of closures traits when they are passed in functions or structs.
1. `FnOnce` -> Uses the value which is passed in it and drops it
2. `FnMut` -> It can modify the passed values
3. `Fn` -> Can take any reference


## Example of `FnOnce`

Consider the rust option enum. Rust option enum has a `unwrap_or_else` function that returns `Some` value or runs the closure to provide the value for. 

Let's dissect the code below. 

```rust
impl<T> Option<T> {
    pub fn unwrap_or_else<F>(self, f: F) -> T
    where
        F: FnOnce() -> T
    {
        match self {
            Some(x) => x,
            None => f(),
        }
    }
}
```

### Observations 

1. The function returns a type `T` which is the value held by the option enum
2. There is a trait bound `f` which is `FnOnce` and returns the same type as the enum. 

So we see can conclude that we need to pass in a closure that takes in no arguments to `unwrap_or_else` and return the same value as the option and it has to run only once.

## Example of `FnMut`

```rust
pub fn sort_by_key<T, F, K>(slice: &mut [T], key_fn: F) 
where
    F: FnMut(&T) -> K,
    K: Key, 
```


```
let mut friends = ["Punchy", "Isabelle", "Sly", "Puddles", "Gladys"];
 
// sort by the length of the string in bytes
radsort::sort_by_key(&mut friends, |s| s.len());
 
assert_eq!(friends, ["Sly", "Punchy", "Gladys", "Puddles", "Isabelle"]);
```

## Example of `Fn`

```rust
fn main() {
fn call_with_one<F>(func: F) -> usize
    where F: Fn(usize) -> usize {
    func(1)
}

let double = |x| x * 2;
let x = call_with_one(double);
// Does not mutate the value, returns the double
println!("{}",x);
}
```

Output 
```
2
```