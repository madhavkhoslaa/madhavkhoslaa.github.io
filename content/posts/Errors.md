---
title: "Error handling in Rust."
date: 2023-06-08T02:01:58+05:30
draft: false
description: " Errors are an inevitable part of any software development process, and Rust provides a robust mechanism for managing and handling them. This blog aims to demystify Rust's error handling philosophy, covering its unique features, error types, and various strategies for effectively dealing with errors."
tags:
  [
  rust,
  erorrs,
] 
---
![image](https://i.imgur.com/VSG6kWK.jpeg)

Errors in any language are hard to handle since they include the caller, defining errors, handling them and reporting to the end user. In this blog I will explain how to handle and create errors in rust.

# Types of Errors 
1. Unrecoverable Errors
2. Recoverable Errors

# How to handle unrecoverable Errors.

These errors are errors that make you want to stop the execution of the program. Like not being able to find a free port for starting the server, division by zero. 
These errors use the `panic` macro to stop the execution of the program in rust.

## Example of panic macro.

```rust 
fn main(){
  let a = 5;
  let b = 0;
  let c = divide(a, b);
  println!("{}", c);
}
fn divide(a: u8, b: u8) -> u8{
  if(b == 0){
  panic!("Division by zero not allowed");
  }
  return a/b;
}
```

The result of this code will be a panic with a message `Division by zero not allowed`.

# How to handle recoverable errors 

These errors are to be handled at runtime and do not stop the execution of the program. Like an empty file in a directory.
Functions that expect to return a success value or an erroneous value use the `Result` enum to wrap the values.
```rust 
enum Result<T, E>{
  Ok(T), 
  Err(E)
}
```

## Example of using a Result enum

```rust 
fn main(){
    let data = get_database_contents(2);
    let data = match data{
        Ok(value) => {value},
        Err(value) => {value}
    };
    println!("{}", data);
}
fn get_database_contents(id: usize) -> Result<String, String>{
  if id == 1{
  return Ok("Database success".to_owned());
  }
  else {
  return Err("Database fail".to_owned());
  }
}
```
Here in the mock function, we return the `Ok` variant of the enum if the argument is 1 and return the `Error` variant of the enum in other cases; The caller of the function has the responsibility of handling the enum variants.

# Syntactical sugar for early returning of errors using the `?` operator.


```rust 
use std::fs::File;
use std::io::{self, Read};
fn read_file(path: &str) -> Result<String, io::Error> {
    let mut file = match File::open(path) {
        Ok(file) => file,
        Err(error) => return Err(error),
    };
    let mut contents = String::new();
    match file.read_to_string(&mut contents) {
        Ok(_) => Ok(contents),
        Err(error) => Err(error),
    }
}

fn main() {
    let file_path = "path/to/your/file.txt";
    match read_file(file_path) {
        Ok(contents) => println!("File contents:\n{}", contents),
        Err(error) => eprintln!("Error reading file: {}", error),
    }
}
```
Using Syntactical sugar for returning errors. 
```rust 
use std::fs::File;
use std::io::Read;
fn read_file(path: &str) -> Result<String, std::io::Error> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?; 
    Ok(contents)
fn main() {
    let file_path = "path/to/your/file.txt";
    match read_file(file_path) {
        Ok(contents) => println!("File contents:\n{}", contents),
        Err(error) => println!("Error reading file: {}", error),
    }
}
```

# Returning different types of errors.
Sometimes you might want to send different types of errors to the function caller in case different errors arise in the execution of the function. Here we have two approaches for the following.
## Dynamic dispatch approach.
In this case, we can use `dynamic dispatch` on the error type and send different types of errors.

```rust 
fn do_operation(arg: &str) -> Result<String, Box<dyn error::Error>>{
  if boolean_response() {
    Ok()
  }
  if boolean_response_for_error1() {
    Err(Box::new(ErrorType1))
  }
  if boolean_response_for_errore() {
    Err(Box::new(ErrorType2))
  }
}
```

### Issue with this approach of using dynamic dispatch
On the runtime we do not know what error type the caller of the function will receive on the runtime hence the error handling will be hard to handle.

## Using Error Enums approach.
We can create an enum with all the values for the enums and then create a match of all the values for the enum. 

```rust 
#[derive(PartialEq, PartialOrd)]
enum APP_FAILURE {
  TIMEOUT,
  NULL_VALUE,
  OTHER_ERROR
}
fn main (){
  let Result = result_returning_function();
  let Result = match Result {
    Ok(value) => {value},
    Err(value) => {
      if(value == APP_FAILURE::TIMEOUT){
        //Do something
      }
      // .. exhaustive comparison list 
    }
  }
}
fn result_returning_function(filename: &str) -> Result<String, APP_FAILURE> {}
```



