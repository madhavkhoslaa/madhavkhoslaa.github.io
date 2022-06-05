---
title: "SOLID Patterns: My lessons on it"
date: 2022-05-03T04:01:25+05:30
description: "SOLID Patterns are a general guideline and reccomended pattenrns that you can use in your codebase to be extensable, easy to modify in future and easy to fix. These aren't hard bound rules just general reccomendations. Here, I'll talk about them in detail."
tags: [SOLID, Design Patterns, Uncle Bob]
---

SOLID is just an acronym for a few principles that Robert C. Martin. SOLID Design princples aim to make your code base extensible, easy to modify in future, easy to debug and fix. They are not RULES just a bunch of thought ideas of seggregation of logic and how to organise your code. 

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

# Open Close Princple

# Liskov Substitution Principle


# Interface Segregation Principle


# Dependency Injection