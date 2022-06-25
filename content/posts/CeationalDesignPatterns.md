---
title: "Creational Design Patterns: My lessons on it"
date: 2022-06-24T02:01:58+05:30
draft: true
description: "Creational design patterns aid in the instantiation of objects by providing suitable abstractions and make the systems independent of how objects are created composed and represented."
tags:
  [
    Design Patterns,
    Gang of four,
    Singleton,
    Prototype,
    Factory,
    Builder,
    Uncle Bob,
  ]
---

# Creational Design Patterns

> [Creational design patterns provide various object creation mechanisms, which increase flexibility and reuse of existing code](https://refactoring.guru/design-patterns/creational-patterns).

Creational design patterns aid in the instantiation of objects by providing suitable abstractions and make the systems independent of how objects are created composed and represented.

They are important when a system grows large and require how objects are constructed rather than what objects are constructed. They are a step above a normal hardcoded instantiation like `const instance = new SomeClass()`

![image](https://i.imgur.com/dmLLnXo.jpeg)

# The Builder Design Pattern

> Builder is a creational design pattern that lets you construct complex objects step by step. The pattern allows you to produce different types and representations of an object using the same construction code.

The Problem: Have you encountered a situation where a class requires so many arguments to be instantiated and some of them are optional too? The instantiation usually goes something like this `const instance = new ClassA(arg1, arg2? arg3, arg4, arg5, arg6)`; and you can relate how easy it is to forget the order of the arguments and what arguments the class requires in the first place. So there is a clear problem of the constructor being too large and complex, there can also be situations where the constructors are overloaded many times as well leading to even more confusion.

Proposal: How about you create a method where you pass in arguments in a more visual way, such that you are aware of what you are passing and such that they provide an easy way to construct objects.

How: You create multiple static variables holding values for the variables you are going to pass in the constructor, you create setter methods for these static variables with static methods, and create a `getInstance` method where you pass in the static variables and return an instance of the class. You can also choose to keep the constructor private if you want your instantiation only from the builder static methods.

> Builder methods provide a piecewise construction of an object

## Code Example

Suppose you need to have an object of type car in your application, maybe for an ORM. You need to create it piecewise and in a verbose manner in your system. This is how you will do it.

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

## Code Explanation

There are many static variables that you set from the static methods, these static methods return `this` so that you can use a chain of these methods. In the end, the `getCar` or an equivalent build function calls the constructor of the class and returns the fully created instance.

## Something Cool (Creating HTML from Code and builder design pattern)

While studying builder design patterns, I was able to create methods to generate HTML pages through code. I created an HTML class and an array that held the tags and the content for the tags. Every static function for header and paragraph took in the string values and appended them to the metadata static array. At the end when the `build` method is called it parses the static metadata array into a string that represents HTML. I was able to create an HTML page by just invoking functions on this object.

{{< gist madhavkhoslaa 70030671bfc1a54946812e6c85b65c16 >}}

## HTML Page Generated From The Above Code

![image](https://i.imgur.com/zurY13J.png)

# Factory Design Pattern

> Factory Method is a creational design pattern that provides an interface for creating objects in a superclass but allows subclasses to alter the type of objects that will be created.

The Problem: Sometimes there are a lot of objects of the same type and kind that have to be created and sometimes those objects can be builder classes too and the instantiation of a builder object is too ceremonial, piecewise, and takes time. To tackle this problem of creating objects piecewise; factory design patterns were made to create objects in a wholesale manner. You just invoke a particular function with a verbose name of what object you want and get the instance of the object. For example, if you have a builder class for cars, you gave call a lot of methods to just create an instance, but in the case of a factory design, you can create a function with an appropriate name that returns the same object every time you invoke it.

Proposal: You create an abstraction where you receive objects of the same type base on what function you call, this abstraction sends the same interface but different implementations of the same interface, so you are not aware of all of the exact classes, just the interfaces.

How: You create a class "called the factory class" and static methods. These static methods have to be verbose enough to tell you what kind of an object they are returning, and that's how you build a factory class.

## Code Example

For example, you have an application that runs on Windows and macOS. However, function calls for windows and macOS are different and you have created two classes to implement the click functionality. Based on the OS you are running your code on, you can decide what kind of button you want from the `ButtonFactory` class.

```TypeScript

interface Button {
    click(): string;
}

class MacOS implements Button{
    constructor(public arg1: string){}
    click(){
        return "MacOS Button says " + this.arg1;
    }
}

class Windows implements Button{
    constructor(public arg1: string){}
    click(){
        return "Windows Button" + this.arg1;
    }
}

class ButtonFactory {
    private constructor(){}
    static getMacOsButton(arg1: string): Button{
        return new MacOS(arg1);
    }
    static getWindowsButton(arg1: string): Button{
        return new Windows(arg1);
    }
}

const MacButton = ButtonFactory.getMacOsButton("Called from factory")
console.log(MacButton.click())
// MacOS Button says Called from factory
const WinButton = ButtonFactory.getWindowsButton("Called from factory")
console.log(WinButton.click())
// Windows ButtonCalled from factory

```

## Explanation

Here there is a single interface called the `Button` and two classes `MacOS` and `Windows` implement that interface. Depending on what instance you want from the factory interface you can get it from the factory class. For Example `const MacButton = ButtonFactory.getMacOsButton("Called from factory")`

# Abstract Factory Design Pattern

> Abstract Factory is a creational design pattern that lets you produce families of related objects without specifying their concrete classes.

The Problem: Now in the above example of buttons, there was a separation based on OS. But imagine in a case of a framework, where there are buttons, alerts, input boxes, and so many things. The call can differ based on the OS they are on. Now imagine you as a developer instantiating a MacOS button, Alert and Windows button, Alert from the class itself; it would be tedious, wouldn't it? To tackle this problem of

Proposal: Provide abstraction of creation of classes without exposing the classes themselves. Provide interfaces to provide factories then build objects through them.

How: Create a top factory class, and create methods to return sub-factory classes that return the final objects.

## Code Example

Suppose you are building a web framework that runs natively on machines(macOS and Windows). The features that you want to provide in the different OS are the same however their implementation varies a lot. So you want to separate the instantiation of buttons, alerts, and other features based on the OS, then based on what the actual functionality is; giving the users choice of what kind of object they need.

For Example, You need to create an alert box for windows. The process would be `Go through library => Choose the functionality you want to do => Choose the OS for the functionality`, Here we are building abstract factories for this very particular use case.

```TypeScript

abstract class AlertBox {
  alert() {}
}

abstract class Button {
  click() {}
}

class MacOSAlert extends AlertBox {
  alert(): void {
    console.log("MacOS Alert");
  }
}

class WindowsAlert extends AlertBox {
  alert(): void {
    console.log("Windows Alert");
  }
}

class MacOSButton extends Button {
  click() {
    console.log("MacOS Click");
  }
}

class WindowsButton extends Button {
  click() {
    console.log("Windows Click");
  }
}

class ButtonFactory {
  Windows(): Button {
    return new WindowsButton();
  }
  MacOs(): Button {
    return new MacOSButton();
  }
}

class AlertFactory {
  Windows() {
    return new WindowsAlert();
  }
  MacOs() {
    return new MacOSAlert();
  }
}
class UIFactory {
  static Button(): ButtonFactory {
    return new ButtonFactory();
  }
  static Alert(): AlertFactory {
    return new AlertFactory();
  }
}

const MacOsButton = UIFactory.Alert().MacOs().alert();
// "MacOS Alert"

```

## Explanation

Here we wanted to create an alert on the macOS, hence from the `UIFactory`, we called the `AlertFactory` which returned an instance of `AlertFactory`. It had two implementations of alert, one being for `MacOS` and the other being for `Windows`. We then called the `macOS` implementation.

You could also argue if the UI factory should be returning a `MacOSFactory` and `WindowsFactory` with their respective implementations, which is a correct implementation too.

# Singleton Design Pattern

> Singleton is a creational design pattern, which ensures that only one object of its kind exists and provides a single point of access to it for any other code.

The Problem: In some scenarios you only want one instance of a class to be present, for example, you have a class that opens a session to the DB and you pass in query strings to it to receive objects. If this object were to be instantiated multiple times in a lifecycle of a program then there will be many connections open in the DB.

Proposal: You create an instance of the class and abstraction to get the instance of the class. That abstraction only returns a single instance of the class always.

How: You create a class with a private constructor, and you create a static method called `getInstance` or something similar. On invoking that function set a static variable of the class with the new instance and return the same instance every time that function is called.

## Code Example

For example, you want to log events in a log file, You want to log a string when some function is called or when some event occurs. Yo

```TypeScript

class LogFileWriter{
    session: any
    static _instance: LogFileWriter
    private __dirname: string = "./logs"
    private filename: string = "log.txr"
    private constructor(){
        session =
    }
    write(log: string){
        writeFileSync(join(this.__dirname, this.filename), log, {
            flag: 'w',
        });
    }
    getLogs(): string{
        return readFileSync(join(this.__dirname, this.filename), 'utf-8');
    }
    static getLogger(): LogFileWriter{
        if(!this._instance){
            this._instance = new LogFileWriter();
        }
        return this._instance;
    }
}

const Logger = LogFileWriter.getLogger();
const Logger2 = LogFileWriter.getLogger();

console.log(Logger == Logger2)
// True
```

## Code Explanation

The `getLogger` method on the first call creates the instance of the `LogFileWriter` class and sets it to the static variable. This on the other runs is then returned from the static class variable it is saved in.

However, in a multithreaded environment, this can create multiple instances if a single thread has a different execution context than the current one.

# Prototype Design Pattern

> Prototype is a creational design pattern that lets you copy existing objects without making your code dependent on their classes.

The Problem: For example every time you create an instance of a class, there is a large blocking operation that takes place in the constructor of the class(Maybe a DB call or a large file read) that happens every time you create an instance, it's better the next time you create the instance, you could somehow use the same data from the old instance. The prototype design pattern solves this problem by providing objects with a clone method, to copy their values to other objects.

Proposal: Provide an object cloning method to the class so that a `.clone()` method will return the copy of the object. I have here created a shallow and deep clone for shallow and deep copies.

How: Create an abstract class for the prototype design pattern, create a generic logic for cloning and extend all the classes with that abstract class where you want them to have cloning methods.

## Code Example

```TypeScript
abstract class IPrototype {
  Shallowclone(): any {
    return Object.assign(this);
  }
  DeepClone(): Object {
    return JSON.parse(JSON.stringify(this));
  }
}

class DB extends IPrototype {
  constructor(public ARR: string[]) {
    super();
  }
}

const d = new DB(["1", "2"]);
console.log(d);
const d2 = d.Shallowclone();
const d3 = d.DeepClone();
console.log(d2);
d.ARR[0] = "-1";
console.log(d);
console.log(d2);
console.log(d3);

/**
 *
 * OutPut
DB { ARR: [ '1', '2' ] }
DB { ARR: [ '1', '2' ] }
DB { ARR: [ '-1', '2' ] }
DB { ARR: [ '-1', '2' ] }
{ ARR: [ '1', '2' ] }
*
**/
```

## Code Explanation

Here the base abstract class provides a `DeepCopy` and a `ShallowCopy` methods and the classes that extend them can use these methods to copy objects to other variables.

---
