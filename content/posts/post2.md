---
title: "Caching: My 2 cents on it"
date: 2022-03-18T02:01:58+05:30
description: "Caching is a cheap way to scale a system's performance in very less time. Being cheap and easy it also brings some problems such as invalidation and infrastructure for setting up the cache itself. Here I plan to talk about some lessons on caching that I've learnt in a few months."
tags: [Caching, Redis, Memcaches]
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

# When to expire cache ?
