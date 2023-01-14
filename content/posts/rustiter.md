---
title: "Functional Programming in Rust 2: Iterators"
date: 2022-11-20T23:01:35+05:30
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

# Iterator Design Pattern, What is it?

## Example 1

Let's consider you are this tiny person in the image and you have to walk traverse the tree below. Ideally, how you traverse it, it does not matter what is the most important thing is __1.__ where you are and __2.__ Where you want to be when you go to the `next` node.

So in a way, an iterator design pattern(in real life) is a thought process of how you iterate a structure(not just a tree), or you know where you want(not how) to go `next`.

It is the way to decide if you go on the left node or the right, or the leaf node of the left subtree or the leaf node of the rightmost subtree but not how you do it.

![image](https://i.imgur.com/mWXRCUt.png)

## Example 2
Imagine you are the Pacman ghost and the representation of the Pacman world is in a graph. Which node you go to is dependent on where Pacman is. Imagine you are on a `T` intersection and Pacman is on the right side of the T intersection. Then the `next` node you want to traverse is the right node.

![image](https://i.imgur.com/5lF87Jv.png)

## Why did I highlight `next` ? | Let's talk Code.

# Iter trait

This 
```rust
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
```

I will talk about the iter trait below in the blog once I get done with explaining how to use pre-built iterators.

# Iterators in Rust

Lazy Iterator example

```rust
let v: Vec<u8> = vec![1,2,3,4];
let vec_iter = v.iter();
```


## Iterating a List using iterators
Using lazy iterator to iterate

### Example 1 (Immutable iterator)

The value of next sends a reference to the value in the data structure. In our case, we create an instance of the iterator called `vec_iter`. Then use it to loop through our list. The iterator's next trait is implemented in the `for in` loop in rust. 

```rust
fn main() {
    let v: Vec<u8> = vec![1,2,3,4];
    let vec_iter = v.iter();
    for vec_val in vec_iter{
        println!("{}", vec_val);
    }
}
```
Output
```
1
2
3
4
```

### Example 1 (Mutable iterator)

For example, if you want to increment the value of the item in the data structure through the loop you need a mutable reference to the value in the data struct. Creating an iterator with `iter_mut` returns mutable references to the value in the loop.

```rust
fn main() {
    let mut v: Vec<u8> = vec![1,2,3,4];
    println!("{:?}", v);
    let vec_iter = v.iter_mut();
    for vec_val in vec_iter{
        *vec_val = *vec_val + 1;
    }
    println!("{:?}", v);
}
```
Output
```
[1, 2, 3, 4]
[2, 3, 4, 5]
```
# Producers of iterators
These are methods that attach to iterators to produce more iterators. Popular examples of these "Producers" are 1. `Map` 2. `Filter`. Also, I assume if you're reading this blog you are aware of the concepts of map and filter.


A map creates an iterator that you can attach other iterators (and so on...).
An obvious question to this is how do you resolve these chained iterators to get a value? This leads us to the next topic



# Consumers of iterators
Consumers are methods like `collect` the take in chained iterators and run it one by one on data that each producer resolves to. 

`Iterator1 => Data => Iterator 2 => Data => Iterator 3 => Data`


^This what a consumer does. 

# Example of how to use producers and consumers of iterators
Let's try to create the above example of iterating to increase the value of elements in an array using `Map`. 
```rust
fn main() {
    let x: Vec<u8> = vec![1, 2, 3, 4];
    let y: Vec<u8> = x.iter().map(|x| x + 1).collect();
    //                        ^---Producer  ^----------------Consumer 
    println!("{:?}", y);
}
```
Output

```
[2, 3, 4, 5]
```

## Using multiple producers


```rust
fn main() {
    let vec: Vec<u8> = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let vec2: Vec<u8> = vec.iter().map(|x| x / 2).map(|x| x + 10).filter(|x| x%2==0).collect();
    // Divides all numbers by 2 into a u8 then adds 10 to everything. Then filters out even numbers
    println!("{:?}", vec2);
}
```
# The three forms of iteration
1. iter(), which iterates over &T.
2. iter_mut(), which iterates over &mut T.
3. into_iter(), which iterates over T.


# Revisiting the Iter trait

```rust
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
```

calling next will return an `Option<Self::item>` as long as there are elements in the collection.


# Example of implementing Iter trait to create own iterator for our data structure.

```rust
struct Counter {
    pub limit: usize,
    count: usize,
}

impl Counter {
    fn new(limit: usize) -> Counter {
        Counter {
            limit,
            count: 0
        }
    }
}
impl Iterator for Counter {
    type Item = usize;
    fn next(&mut self) -> Option<Self::Item>{
        if self.count <= self.limit {
            self.count += 1;
            return Some(self.count);
        }
        None
    }
}
fn main() {
    let mut c = Counter::new(10);
    let mut start = Some(0);
    loop {
        if start == None {
            break;
        }
        println!("{}", start.unwrap());
        start = c.next();
    }
}
```
Output 

```
0
1
2
3
4
5
6
7
8
9
10
11
```

# How to create an iterator to traverse a tree using for loops !!!! [FUN CODE AHEAD!]

![image](https://i.imgur.com/Unw3Dwf.jpeg)

```rust
// More than two derives
// generics
// Deref coercion
#[derive(Debug, Clone)]
struct Node {
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
    value: u8,
}

struct PreTreeIterator {
    head: Node,
    iter_list: Vec<u8>,
    current_value: Option<u8>,
    ctr: usize,
}

impl PreTreeIterator {
    pub fn new(head: &Node) -> PreTreeIterator {
        PreTreeIterator {
            head: head.clone(),
            iter_list: vec![],
            current_value: None,
            ctr: 0,
        }
    }

    pub fn generate_iter_list(&mut self, head: &Node) {
        match &head.left {
            Some(x) => {
                self.generate_iter_list(x);
            }
            None => {}
        }
        self.iter_list.push(head.value);

        match &head.right {
            Some(x) => {
                self.generate_iter_list(x);
            }
            None => {}
        }
    }
}

impl Iterator for PreTreeIterator {
    type Item = u8;

    fn next(&mut self) -> Option<Self::Item> {
        if self.ctr < self.iter_list.len() {
            let to_return = *self.iter_list.get(self.ctr).unwrap();
            self.ctr += 1;
            return Some(to_return);
        } else {
            None
        }
    }
}

fn main() {
    let tree = Node {
        left: Some(Box::new(Node {
            left: None,
            right: Some(Box::new(Node {
                left: None,
                right: None,
                value: 3,
            })),
            value: 2,
        })),
        right: Some(Box::new(Node {
            left: None,
            right: None,
            value: 9,
        })),
        value: 1,
    };
    println!("{:?}", tree);
    let mut iter = PreTreeIterator::new(&tree);
    println!("{:?}", iter.iter_list);
    iter.generate_iter_list(&tree);
    println!("{:?}", iter.iter_list);

    println!("Looping through the tree in preiterator way using iterator design pattern");
    loop {
        let value = iter.next();
        if value == None {
            break;
        }
        println!("{:?}", value.unwrap());
    }

    // Node { left: Some(Node { left: None, right: Some(Node { left: None, right: None, value: 3 }), value: 2 }), right: Some(Node { left: None, right: None, value: 9 }), value: 1 }
}

```
## Output 


```
[]
[2, 3, 1, 9]
Looping through the tree in pre-order way using the iterator design pattern
2
3
1
9
```

---

Sources