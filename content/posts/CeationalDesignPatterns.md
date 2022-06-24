---
title: "Creational Design Patterns: My lessons on it"
date: 2022-06-24T02:01:58+05:30
description: "Creational design patterns aid in the instantiation of objects by providing suitable abstractions and make the systems independent of how objects are created composed and represented."
tags: [Design Patterns, Gang of four, Singleton, Prototype, Factory, Builder]
---

# Creational Design Patterns

> [Creational design patterns provide various object creation mechanisms, which increase flexibility and reuse of existing code](https://refactoring.guru/design-patterns/creational-patterns).

Creational design patterns aid in the instantiation of objects by providing suitable abstractions and make the systems independent of how objects are created composed and represented.

They are important when a system grows large and require how objects are constructed rather than what objects are constructed. They are a step above a normal hardcoded instantiation like `const instance = new SomeClass()`

![image](https://i.imgur.com/dmLLnXo.jpeg)

# The Builder Design Pattern

The Problem: Have you encountered a situation where a class requires so many arguments to be instantiated and some of them are optional too? The instantiation usually goes something like this `const instance = new ClassA(arg1, arg2? arg3, arg4, arg5, arg6)`; and you can relate how easy it is to forget the order of the arguments and what arguments the class requires in the first place. So there is a clear problem of the constructor being too large and complex, there can also be situations where the constructors are overloaded many times as well leading to even more confusion.

Proposal: How about you create a method where you pass in arguments in a more visual way, such that you are aware of what you are passing and such that they provide an easy way to construct objects.

How: You create multiple static variables holding values for the variables you are going to pass in the constructor, you create setter methods for these static variables with static methods, and create a `getInstance` method where you pass in the static variables and return an instance of the class. You can also choose to keep the constructor private if you want your instantiation only from the builder static methods.

> Builder methods provide a piecewise construction of an object

```TypeScript
class Car{
    static _color: string;
    static _pistons: number;
    static _wheelbase: number;
    static _length: number;
    public color: string;
    public pistons: number;
    public wheelbase: number;
    public length: number;
    private constructor(color: string, pistons: number, wheelbase: number, length: number){
        this.color = color;
        this.pistons = pistons;
        this.wheelbase = wheelbase;
        this.length = length;
    }
    static setColor(color: string){
        this._color = color;
        return this;
    }
    static setPistons(pistons: number){
        this._pistons = pistons;
        return this;
    }
    static setWheelbase(wheelbase: number){
        this._wheelbase = wheelbase;
        return this;
    }
    static setLength(length: number){
        this._length = length;
        return this;
    }
    static getCar(){
        // Logic for checking values and passing in default values;
        return new Car(this._color, this._pistons, this._wheelbase, this._length);
    }
}

const RedFerrari: Car = Car.setColor("Red")
                        .setPistons(12)
                        .setLength(2100)
                        .setWheelbase(40)
                        .getCar();
console.log(RedFerrari)
/**
Car: {
    "color": "Red",
    "pistons": 12,
    "wheelbase": 40,
    "length": 2100
}
**/

```

## Somethig Really Cool (Creating HTML from Code and builder design pattern)

<!-- While studing builder design patterns, I was able to create a methods to generate HTML pages through code. I created a -->

{{< gist madhavkhoslaa 70030671bfc1a54946812e6c85b65c16 >}}

## HTML Page Generated From The Above Code

![image](https://i.imgur.com/zurY13J.png)

# Factory Design Pattern

The Problem :

Proposal :

How :

# Abstract Factory Design Pattern

The Problem :

Proposal :

How :

# Singleton Design Pattern

The Problem :

Proposal :

How :

Discuss the multithreading problem and how Prototype solves it

# Prototype Design Pattern

The Problem :

Proposal :

How :
