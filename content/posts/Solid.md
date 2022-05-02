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
 
# Single Responsibility Principle
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

What is the issue with this code ?

A better implementation
```typescript
abstract class Writeable{
    toString(){}
    toJSON(){}
    toS3(){}
}

class Notebook extends Writeable {}

class Diary extends Writeable {}
```
# Open Close Princple

# Liskov Substitution Principle


# Interface Segregation Principle


# Dependency Injection