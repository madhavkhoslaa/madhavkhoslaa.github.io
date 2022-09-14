---
title: "Functional Programming in Rust"
date: 2022-09-14T02:01:58+05:30
draft: false
description: ""
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
![image](https://i.imgur.com/B6XmCCS.png)


# What is Functional Programming ?

It is a Programming Paradigm where you use functions to solve what you are building. Most common features that you might have used FP in any language will be Map and Reduce.
Where you pass in a function what iterates in the collection you run map or reduce on.

Rust has some functional features too that I plan to write here.

# Closures

Let's do a quick Google search "closures"; The first result that comes to me is from MDN.

Let's see what MDN has to say(even though it is JS).

`A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function's scope from an inner function.`

## What information can we take from this statement?
1. It is a function that is inside a function
2. The inner function shares the same enviorment as the outer function.

## What information we can conclude from this statement ?
1. The variables defined in the outer function are accessable in the inner function.

There is alot of information that is left here in context of rust, but hold on for a while :D

# Syntax for closure in Rust.

Take a look carefully on how you can create closures in rust. 

1. You give no typpe signatures for the formal arguments.
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

So closures in rust are kind of "Pythonic" in a way where you can choose to give function type signatures, Right ? Yes, but to an extent. Look at this example

## Playing with Closures !!!!
```rust
fn main() {
    let example = |arg| arg + 10;
    //  ^ This closure has no types for the arg, it just adds 10 to any type that supports addition(We can assume the minimum requirment of the type here)
    let x: usize = 10;
    let y: u8 = 11;
    example(x);
    // Called with type "usize"
    example(y);
    // Called with type "u8"
}
```
You might expect this program to compile correctly and on runtime to print 21 and 21. 

But we recieve a compile error.

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
When we disect the error(Rust has best errors btw) we see that on the second time the compiler says that "expected `usize` found `u8`" and then gives a suggestion.

So we learn that a closure takes the first arguments type and return type as the type signature of the closure.


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
We cacn observe here that variable b is accessable inside of closure a, so we can conclude that a closure shares the same scope as the parent.
## Phew, alot of stuff to learn. Let's break down what I wrote down
1. Closures are funtions that are inside a function and hence share the same scope as the parent function.
2. The are "Pythonic" in a way that they do not need type signatures but instead the compiler gives it a signature based off the type of arguments on the first call.

