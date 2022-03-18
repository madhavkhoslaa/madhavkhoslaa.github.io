---
title: "Caching: My lessons on it"
date: 2022-03-18T02:01:58+05:30
description: "Caching is a cheap way to scale a system's performance in very less time. Being cheap and easy it also brings some problems such as invalidation and infrastructure for setting up the cache itself. Here I plan to talk about some lessons on caching that I've learnt in a few months."
tags: [Caching, Redis, Memcached]
---

Caching is a cheap way to scale a system's performance in very less time. Being cheap and easy to implement over a system it also brings some problems such as invalidation and infrastructure for setting up the cache itself. Here I plan to talk about some lessons on caching that I've learnt in a few months.

<!-- ![image](https://i.imgur.com/1TQhmvt.jpeg) -->

# Philosophy of Caching

_The supreme art of war is to subdue the enemy without fighting it - Sun Tzu_

# Caching

Caching in a pure function system is when you store the arguments to a particular function and use the result stored instead of actually invoking the function and for a good approach to caching you might want to design your caching scheme in such a way that for most responses the cache is actually used instead of performing a expensive operation again.
This need of reusability of cache is called increasing the "Cache-Hit Ratio". We will talk about "Cache-Hit Ratio" now and ways to maximise it.

# Cache-Hit Ratio

In mathematical is the ration of cache used to total objects cached in your system; But what does it convey to you ?
A high cache hit ratio means that your cache was used for most objects that were cached and hence you saved alot of CPU time for logic that was already computed. So how do you achieve a high Cache-Hit Ratio ?

# Methodlogies for increasing the "Cache-Hit Ratio"

1. **Cache Key Space** - Describes the number of keys in your cache if you have a key value based cache sysem.
2. **Average TTL** - How long a particular object is cached for, you just don't want to store objects forever since storage costs $$, Longer the TTL the better, You do not have to worry alot since algoritms like LRU and so on manage this for you.
3. **Average size of cached object** - This affects the first object in this list due to hardware constricts you can obviously store a certain amount of objects depending upon their size. The larger the size of the object the lesser the Cache Key Space it, Hence it might lead to a lower Cache-Hit Ratio

## How to achieve a large Cache Key Space ?

1. Choosing a scheme in which cache is common among users
2. Keeping the size of the cached object such that more objects could be stored and hardware is not a construct.

# Where to cache ?

![image](https://i.imgur.com/xIFu5IS.jpeg)
In this scenario imagine you have 3 functions calling each other in the call stack and the result is produced by calling them all.
Assume you call f(a) and inside the implementation it passes the value to f(f(a)) and so on.
I am assuming the cost of each operation likewise in the table.
| Function | Time |
| ----------- | ----------- |
| f(a) | 15 ms |
| f(f(a)) | 10 ms |
| f(f(f(a))) | 5 ms |
| Time to fetch cache | 1 ms |

Let's assume the following scenarios for caching the call stack.

| Function Cached | Time                        | Time(ms) |
| --------------- | --------------------------- | -------- |
| No Cache        | f(a) + f(f(a)) + f(f(f(a))) | 30 ms    |
| f(f(a))         | f(a) + f(f(a)) + Cache Time | 26 ms    |
| f(f(f(a)))      | f(a) + Cache Time           | 16ms     |
| f(a)            | Cache Time                  | 1ms      |

_Observation_ : The higher we cache up the call stack the lesser functions are called and the time for resolving the function is reduced.

_*Hence*_, as a thumb of rule caching high up the call stack is the best approch for caching in a system where function calls are chained and are a bottlneck in terms of time.

# Cache rule of thumb

# When to expire cache ?

**Scenario 1**:
Assume you have a User A and you have a system where you have multiple inputs such as User A's Height, User A's Age, User A's Major and you have an heuristic algorithm where you determine if User A uses Arch Linux or not. And also look at a key-value cache as an example running sideways

Imagine two scenarios in this case.

_**at T0**_

| Inputs | Time    |
| ------ | ------- |
| Age    | 22      |
| Height | 175 cms |
| Major  | CS      |

_**Algorithm predicts that User A uses Arch Linux.**_

Diagram here (t0 run and cache value)

_**at T1**_

User A changes his major to design and now for some reason uses MacOS.

| Inputs | Time    |
| ------ | ------- |
| Age    | 22      |
| Height | 175 cms |
| Major  | Design  |

Diagram here (t1 value)

_**Algorithm predicts that User A uses MacOS.**_

Now, we know that the user will be using MacOS but the cache will return _**Arch Linux.**_ to the front end.

_**So, we take a lesson that cache is always a side effect of the inputs that you put in a system, if you change the inputs you have to update the cache to the most recent result.**_

**Scenario 2**:
Assume you make a really cool and hyped application and there are alot of new users logging in. You are caching some value ELABORATE HERE for every user. You have a large cache key. But for some reason the older users are not logging in anymore and the hype is dead. You are still storing cache of the old users and the current users that are still using the platform. Caching on RAM is expensive and useless cache means still bills from cloud providers.

Solution: You delete the cache for the users that are inactive and are not using the platform anymore; Thankfully for this kinf of invalidation you do not have to worry. Most caching technologies for example: redis support LRU iviction for deleting unused caches and keeping your cache hit ratio high.

# Types of caching technologies

1. Browser Cache
2. Caching Proxies
3. Reverse Proxies
4. CDN

# Caching for different use cases

1. Read Intensive
2. Write Intensive
3. Distributing content to users

# Read Trough and write through cache

![image](https://i.imgur.com/QVYG6WC.jpeg)

# Using a CDN

---
