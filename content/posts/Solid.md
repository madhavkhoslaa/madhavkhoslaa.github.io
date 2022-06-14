---
title: "SOLID Patterns: My lessons on it"
date: 2022-06-07T04:01:25+05:30
description: "SOLID Patterns are a general guideline and reccomended pattenrns that you can use in your codebase to be extensable, easy to modify in future and easy to fix. These aren't hard bound rules just general reccomendations. Here, I'll talk about them in detail."
tags: [SOLID, Design Patterns, Uncle Bob]
---

SOLID is just an acronym for a few principles that Robert C. Martin compiled together. SOLID Design princples aim to make your code base extensible, easy to modify in future, easy to debug and fix. They are not RULES just a bunch of thought ideas of seggregation of logic and how to organise your code. 

**S** => [Single Responsibility Principle](#Single-Responsibility-Principle)  
**O** => [Open Close Princple](#Open-Close-Princple)  
**L** => [Liskov Substitution Principle](#Liskov-Substitution-Principle)  
**I** => [Interface Segregation Principle](#Interface-Segregation-Principle)  
**D** => [Dependency Injection](#Dependency-Injection)  
 
# 1 Single Responsibility Principle
According to the defination SRP is: 
> A class should have one and only one reason to change, meaning that a class should have only one job.  

But, what does it actually mean ??

It means that if you have multiple functionalities in your application, then there should be a seperate class or an entity for them, this leads to seperation of concerns and fixing a bug related to a feature will be changes in the respective entity. 
For Example you have a program to write a diary and have options to store it to JSON, to S3 and what not. 

```typescript
class NoteBook {
    pageCount = 0;
    pages = []
    constructor(public name){}
    writePage(contents: string){
        this.pages.push(contents)
        this.pageCount +=1
    }
    getPage(idx: number){
        return pages[idx];
    }
    getPages(){
        return pageCount
    }
    toString(){
        return pages.toString()
    }
    toJSON(){
        return {contents: this.toString()}
    }
    toS3(){
        aws.S3.uploadBucketData(this.toJSON())
    }

}
```

## 1.1 What is the issue with this code ?

Let's observe the behavior of the class in the above code. 

1.  Handles the logic for notebooks. Such as adding pages, deleting pages, getting page count.
2. Parsing the code to JSON, String.
3. Saving the Code to S3 or some file.

If we observe functions like toS3(), there might be other classes that require the same functionality as well, such as a `Diary Class` ? We might write same code for the other class that might require the same functionality.

You see the problem here ? There is no code reusability a single class has too many functions and writing and persisting are thightly coupled to each other in this implementation. 

This implementation over time will lead to formation of a "God Class", where a single class is doing too much work. This leads to difficulty in fixing bugs, specialised implementations for every single class and not generic implementations.

We can fix these issues by thinking of different functionalities as different classes or different responsibilities, that handle only that set of related functionalities. Like a persiatance class, a different class to create Notebook objects.


### 1.2 A Better Implementation

```typescript
abstract class Persistance{
    toString(){}
    toJSON(){}
    toS3(){}
}

class NotebookPersistance extends Persistance{
    notebook: Notebook
    constructor(_notebook: Notebook){
        this.notebook = _notebook
    }
    toS3(){
        // Some Logic to S3
    }
    toJSON(){
        // Some Logic to JSON
    }
    toString(){
        // Some Logic to String
    }
}
class DiaryPersistance extends Persistance{
    diary: Diary
    constructor(_diary_: Notebook){
        this.diary = _diary
    }
    toS3(){
        // Some Logic to S3
    }
    toJSON(){
        // Some Logic to JSON
    }
    toString(){
        // Some Logic to String
    }
}
abstract class Writeable{
    pageCount: number = 0;
    pages: number = []
    writePage(contents: string){
        this.pages.push(contents)
        this.pageCount +=1
    }
    getPage(idx: number){
        return pages[idx];
    }
    getPagesCount(){
        return pageCount
    }
    deletePage(idx: number){
        delete pages[idx]
    }
}

class Notebook extends Writeable {}
class Diary extends Writeable {}

const RedNoteBook = new NoteBook()
RedNoteBook.writePage("Java Notes")
RedNoteBook.writePage("Python Notes")
const NoteBookSavingHandler = new NotebookPersistance(RedNoteBook)
NoteBookSavingHandler.toS3()
```
### 1.2.1 Observatations from the implementation above.
1. There are two abstract classes one being `Writeable` and the other one being `Persistance`
2. The `Notebook` and `Diary` class extend the `Writeable` abstract class
3. The `NotebookPersistance` and `DiaryPersistance` class extend the `Persistance` abstract class
Here the writing implementation and the saving of the writing implemetations are loosly coupled and not in a single class coupled together.


### 1.2.2 How is this implementation better than the one above ?

Here the two responsibilities of creation, writing of a notebook and the storage of it are loosly coupled and are written seperately. 

## Lessons

Thinking of responsibilities and features similar to each other to be in a similar object that can apply the desired functionality to any other object that requires it.

# 2 Open Close Princple

According to the definations OCP is
> Software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification.”

The idea is to write your code in such a way that to add functionality you do not have to fiddle with the existing code. The idea sounds great but when one of your class has to change and you have to reflect changes in all other classes. For example a method from class A returns a value x and after the change it returns instance of a class y. You have to change your logic every place where that function is called.

So how do you solve this problem of a changing class being a dependency ?

Bertrand Mayer proposes to use inheritance to achieve this goal since, in his words 
> A class is closed, since it may be compiled, stored in a library, baselined, and used by client classes. But it is also open, since any new class may use it as parent, adding new features. When a descendant class is defined, there is no need to change the original or to disturb its clients.

let us see this principle in an example. 

Suppose you have a API where you and multiple engineers are working together in different teams. And the product calculates area of polygons. You have a class for squares in your codebase already, you get an immediate requirment where you have to add support for rectangles, what do you do ? Overload Area and Perimeter in the square class itself ? Or you extend a class for polygons and create new implementations of rectangle logic ? 

Obviosuly the latter option, since it brings no changes to the place where square logic is used, it is logically seperated from the square class and you did not have to change the existing codebase. 

This is a vague code for the situation.

```TypeScript
abstract Class Polygon{
	Area(){}
	Perimeter{}
}

Class Square extends Polygon{
    Area(len: number){
		return len*len;
	}
	Perimeter(int len){
		return 4*len
	}
}

Class Rectangle extends Polygon{
    Area(len: number, br: number){
		return len*br;
	}
	Perimeter(len: number, br: number){
		return 2*(len + br);
	}
}

Class Triangle extends Polygon{
    Area(len: number, br: number, height: number){
		return 0.5 * len * br* height
	}
	Perimeter(len: number, br: number, height: number){
		return len + br + height
	}}

```

# 3 Liskov Substitution Principle

> Let Φ(x) be a property provable about objects x of type T. Then Φ(y) should be true for objects y of type S where S is a subtype of T.

in other words, "If S is a subtype of T, then objects of type T maybe replaced with objects of type S" .


```TypeScript
interface Family {
    Message(){}
    LastName()
    FirstName()
    LastName()
}
class Parent implements Family{
    constructor(){}
    Message(){
        return "I'm a parent";
    }
    LastName()
    FirstName()
    LastName()
}

class Child extends Parent implements Family {
    constructor(){}
    Message(){
        return "I'm a child";
    }
}

class FamilyLogger {
    f: Family
    constructor(f: Family){
        this.f = f;
    }
    log(){
    console.log(Object.getOwnPropertyNames(Math).filter(function (p) {
    if(typeof Math[p] === 'function'){
        console.log(p());
    }
    }));
    }
}

const p : Parent = new Parent();
const c : Child = new Child();
const Parentlogger = new FamilyLogger(p);
const Childlogger = new FamilyLogger(c);
Parentlogger.log();
Childlogger.log();
```
Here we have a logger class that takes in a object of type family in it. The Parent class implements family interface and the Child class extends Parent class.

The logger class iterates through each function in the local instance and runs it and logs to the console.

Hence we see that both parent and child instances are passes to the same class withouit breaking the code.

This is essentially what LSP is.

# 4 Interface Segregation Principle

> Clients should not be forced to depend upon interfaces that they do not use.”

This principle is sort of a extension of the first solid principle with the central theme being iterfaces. 

A single interface should not have multiple responsibilities forming a god interface instead there should be multiple interfaces for different responsibilities. 

The interface should exist in such a way that classes that implement those do not have many unused functions. 

An interface should aptly represent a class that it implements, it should not hide major implementations nor share unused implementatations.
```TypeScript

interface Animal{
    walk()
    breathe()
    run()
}

interface dog extends Animal {
    bark()
    wagTail()
}
```

# 5 Dependency Inversion

> high level modules should not depend on low level modules; both should depend on abstractions. Abstractions should not depend on details.  Details should depend upon abstractions.

What it means is that class A uses a instance of a DB session. That DB session is defined within the constructor of the class. This session is only connected with the production DB. 

What is you have a scenario where you need to test that class using a test DB session ? What will you do ? How will you solve this ? 

Dependency Invesrions aims to solve this by saying that dependencies should be given to the class where it is called from, the place where the class is instanciated is responsible for passing in the instance of DB to the class, hence inverting the control of dependencies. 


```TypeScript

class StudentDao{
    constructor(){
        this.session = session.connect("mongo://example.url")
    }
    getStudentbyName(name: string){
        this.session.findOne({name})
    }
    getStudentbyRoll(roll: number){
        this.session.findOne({roll})
    }
}

// In Application Code
const studentdio = new StudentDao()
studentdio.getStudentbyName("Bob")
//
```

# 5.1 What is the issue with the code ? 

The `StudentDao` class is thightly coupled with the production session. If we want to use the class in out test enviorment, this would be hard since we want to run the class on a DB session instance which is not present. Hence we can pass in the instance of the Database session where we instanciate the class.

```TypeScript
class StudentDao{
    session: SessionType
    constructor(session: SessionType){
        this.session = session
    }
    getStudentbyName(name: string){
        this.session.findOne({name})
    }
    getStudentbyRoll(roll: number){
        this.session.findOne({roll})
    }
}

if(process.ENV.name === "test"){
    const studentdio = new StudentDao(new TestMongoSession())
studentdio.getStudentbyName("Bob")
}

if(process.ENV.name === "prod"){
    const studentdio = new StudentDao(new ProdMongoSession())
studentdio.getStudentbyName("Bob")
}
```

Here you can see the place that is responsible for calling the instance is responsble for passing in the correct session instance to the class depending on the use case.