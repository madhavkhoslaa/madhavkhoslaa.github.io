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

# What is a hash ?

# Collision Hash

# Hash Collisions

# Base 62 Hashing

# How to store shortened URLs and large URLs ?

# How to redirect URLs ?

# 301 vs 304 URLs 

# Storing clicks and information about it.
