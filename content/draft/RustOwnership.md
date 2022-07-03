---
title: "Understanding Rust Ownership"
date: 2022-07-03T02:01:58+05:30
draft: false
description: "Ownership is one of the features that make it different than so many programming languages and what makes it memory safe and a good language for concurrent programming. It solves problems like null pointers, dangling pointers and data races."
tags:
  [
    "Rust",
    "Ownership",
    "Not C++",
    "Blazingly Fast",
    "Ferris",
    "Borrowing",
    "heap",
    "stack",
    "pointers",
  ]
---

Ownership is one of the features that make it different than so many programming languages and what makes it memory safe and a good language for concurrent programming. It solves problems like null pointers, dangling pointers and data races without a garbage collector at the run time.

# Understanding Rust Ownership

![image](https://i.imgur.com/j5Pxkuu.jpg)

# How is data stored in the program?

1. Stack
2. Heap

Data(variables in function arguments and defined) in the stack have a known type hence the size of the data in the stack is known at the time of compilation. However, data types like vectors and strings are bound to grow in size hence they are stored in the heap(their size cannot be determined at the time of compilation).

![image](https://i.imgur.com/jiQn04E.png)
The image above shows the organization of a stack.

# What is ownership?

Rust aims to solve problems like dangling pointers in languages like C++([CPP Slander](https://www.youtube.com/watch?v=Nq5ZbOOJGwg)).

Problem 1

```c++
Node* a = new Node();
some_funtion(a);
*a->next = new Node()
void some_funtion(Node* node){
    delete a;
}
```

Problem 2

```cpp
some_function(){
    for(int i = 0; i<100; i++){
        Node* n = new Node();
    }
}
```

Problems like these in rust are rare and you know when you are making those.

Ownership is how rust compiler managers data in the heap safely without a garbage collector at the compile time.

# Rules of ownership

1. Each value in Rust has an owner.
2. There can only be one owner at a time.
3. When the owner goes out of scope, the value will be dropped.

Source: [Rust Lang Book](https://doc.rust-lang.org/book/title-page.html)

## What is value?

```rust
fn main(){
    let a = String::from("Hello World");
//  ^ Owner ^Value
}
```

# Understanding ownership through real-life examples

## Scenario 1

1. Assume you have a laptop.
2. Your friend wants to borrow your laptop

```rust
fn main(){
    let madhav = String::from("Madhav's Laptop");
    // Madhav is the owner and he owns the string value";
    let diya = madhav;
    println!("Diya = {}, Madhav = {}", madhav, diya);
}
```

relating to other languages like c++, you might expect that variable named `diya` will have the value of the string, and the variable `madhav` will have it too? However, the output says something different.
Output:

```
error[E0382]: borrow of moved value: `madhav`
 --> src/main.rs:5:40
  |
2 |     let madhav = String::from("Madhav's Laptop");
  |         ------ move occurs because `madhav` has type `String`, which does not implement the `Copy` trait
3 |     // Madhav is the owner and he owns the value "Madhav's Laptop";
4 |     let diya = madhav;
  |                ------ value moved here
5 |     println!("Diya = {}, Madhav = {}", madhav, diya);
  |                                        ^^^^^^ value borrowed here after move
  |
  = note: this error originates in the macro `$crate::format_args_nl` (in Nightly builds, run with -Z macro-backtrace for more info)

For more information about this error, try `rustc --explain E0382`.
```

Just like in reality if madhav gives his laptop to diya he will not have the laptop while the laptop is with diya, right?

### Explaination

(Read #Rules of ownership 1. and 2.). These rules state that for a value there can be only one owner. In the case above there were two owners at the same time. And we got an error saying `borrow of moved value: madhav` when we tried printing the value of the variable `madhav`.

#### So what is a move in rust?

```rust
let a = String::from("Some string");
let b = a; // This is a move
```

in other languages, b might copy the value of a or point to the same location as a. but in rust, there can be only one owner to a value as we studied above. So what happens is b takes the ownership of the value that a point towards.

#### How does diya gets madhav's laptop?

```rust
fn main(){
    let madhav = String::from("Madhav's Laptop");
    // Madhav is the owner and he owns the string value";
    let diya = &madhav;
    println!("Diya = {}, Madhav = {}", madhav, diya);
}
```

Here the variable `diya` borrows the value from the variable `madhav`.

Output

```
Diya = Madhav's Laptop, Madhav = Madhav's Laptop
```

## Scenario 2

1. Assume you have a Laptop and you need to overclock it.
2. Your friend `borrows` your laptop and overclocks it.
3. Friend returns the laptop to you

`madhav` variables pass his laptop to the function `overclock_laptop()` and expects laptop string to be appended with "+ 2Ghz" but what does happen?

```rust
fn main(){
    let madhav = String::from("Madhav's Laptop");
    // Madhav is the owner and he owns the string value";
    let madhav = overclock_laptop(madhav);
    println!("{}", madhav)

}

fn overclock_laptop(mut laptop: String) -> String {
    laptop.push_str(" + 2Ghz");
    return laptop;
}
```

output

```
Madhav's Laptop + 2Ghz
```

This code works fine, but there's a tiny inconvenience here. The inconvenience is that we have to pass around ownership from functions to variables again and again at our point you will have to return tuples and it can get messy.

### Borrowing in function

Here we create a mutable variable `madhav` we pass in the mutable reference to the function `overclock_laptop`, where the variable is mutated, Notice here we did not have to switch ownership multiple times, since the function borrowed the value once and it got reflected in the variable in the function main.

```rust
fn main(){
    let mut madhav = String::from("Madhav's Laptop");
    overclock_laptop(&mut madhav);
    println!("{}", madhav);
}
fn overclock_laptop(laptop: &mut String) {
    laptop.push_str("+ 2Ghz");
}
```

Output:

```
Madhav's Laptop + 2Ghz
```

# What is stored in the heap?

1. String
2. Vector
3. Structs - A `struct` could have alot of fields and making a decision to copy the values would be cost inefficient and a borrowed reference will be better..

---
