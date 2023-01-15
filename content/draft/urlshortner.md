---
title: "How to make a URL shortner"
date: 2022-06-27T02:01:58+05:30
draft: false
description: ""
tags:
  [
    System Design,
    Hashing,
    Base62,
    Bloom Filter,
    SQL,
    MongoDB, 
    Redis,
    Redirect
  ]
---

# What is a URL shortner ?

It is a service that takes in a larger URL and turns it into a smaller URL, for the sake of: 
1. Convencice
2. Tracking clicks 
3. Tracking where the URL was opened from.

For Example: 

Long URL: `https://www.amazon.in/gp/bestsellers/?ref_=nav_em_cs_bestsellers_0_1_1_2`                                 
Short URL: `http://MyWebSite.com/{key}`

We replaced the larger url with a unique key in out system from which we can identify our unique key.

# How to generate a key ?
You need a way to transform your string to an other string, it could be either a set of random charecters or using a hashing algorithm.
You use a hashing function to create a key that does not exist our system and is unique to a (long url) or (long url + user)

# What is hashing and a hash function ?
hasing is the process of transforming a string to another key to a shorter representation, this is used in python to implement dictionaries which are also called "hash tables".

A hashing function is a function that transforms a larger string to a smaller one. A good hashing function is a function in which no two strings have the same hash.

Hashing function Example: 
```python
def hash(key_str): 
  return key_str[0:3] + "abc"
print(hash("google.com"))
// ooabc
print(hash("googgggle.com"))
// ooabc
```

# Collision Hash
Let's observe our hashing function.
This hasing function is not the best function becasue two different URLs have exactly the same hash.
The scenario when we have one same hash for two completely different inputs is called a hash collision. 
A good hasing algorithm has very less hash collisions.

# Good enough hasing algorithm
```python
key_value_store = {}
PREFIX="lmn"
POST_FIX="abc"
def hash_url(long_url):
    curr_hash = basic_hash(long_url)
    if(curr_hash in key_value_store):
        hash_url = POST_FIX + long_url + PREFIX
        curr_hash = basic_hash(hash_url)
    key_value_store[curr_hash] = long_url
    return curr_hash

def basic_hash(long_url):
  return long_url[0:4] + "xyz"

hash_url("google.com")
hash_url("goooogle.com")
hash_url("gooooglee.com")
print(key_value_store)
# {'googxyz': 'google.com', 'goooxyz': 'goooo2gle.com', 'abcgxyz': 'goooo3glee.com'}
```
# Base 62 Hashing


# How do we get indexed for URLs ?
# How to store shortened URLs and large URLs ?

# How to redirect URLs ?

# HTTP 30x Codes

# Storing clicks and information about it.
