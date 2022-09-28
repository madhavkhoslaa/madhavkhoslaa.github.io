---
title: "Functional Programming in Rust 2: Iterators"
date: 2022-09-28T23:01:35+05:30
draft: false
description: "Creational design patterns aid in the instantiation of objects by providing suitable abstractions and make the systems independent of how objects are created composed and represented."
tags:
  [
    Design Patterns,
    Iterator Design Pattern,
    Rust,
    Blazingly Fast,
    loops,
    Not C++
  ]
---

# Iterator Design Pattern, What is it ?

## Example 1

Let's consider you are this tiny person in the image and you have too walk traverse the tree below. Ideally how you traverse it, it does not matter what is the most important thing is __1.__ where you are and __2.__ Where you want to be when you go to the `next` node.

So in a way an iterator design pattern(in real life) is a thought process of how you iterate a structure(not just a tree), or you knowing where you want(not how) to go `next`.

It is the way to decide if you go on the left node or the right, or the leaf node of the left subtree or the leaf node of the right most subtree but not how you do it.

![image](https://i.imgur.com/mWXRCUt.png)

## Example 2
Imagine you are the pacman ghost and the representation of the pacman world is in a graph. Which node you go to is dependant on where pacman is. Imagine you are on a `T` intersection and pacman is on thr right side of the T intersection. Then the `next` node you want to treverse is the right node.

![image](https://i.imgur.com/5lF87Jv.png)

## Why did I highlight `next` ? | Let's talk Code.
https://doc.rust-lang.org/stable/std/iter/


```rust

trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}

```



# Iterators in Rust



## Iterating a List using iterators

Lazy Iterator example

# Producers of iterators


# Consumers of iterators


# Complex usage of producers and consumers


# Iter trait


# Using Iter trait to create own iterator for our data struct

1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
We want out iter to return us only odd values in a DS