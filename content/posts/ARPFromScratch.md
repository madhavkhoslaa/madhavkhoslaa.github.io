---
title: "Writing ARP From Scratch and My Learnings"
date: 2026-09-03T02:01:58+05:30
description: "Implementing Address Resolution Protocol and Sharing My Learnings on network programming."
tags: [Networking, C, Rust, Internet Protocol, Switch]
draft: true
---

![image](/images/arp.jpg)

## What this blog covers and expects you to know.
### Expectations
* Know what ethernet frame is like.
* Know how to use wireshark.
* endianness
### Covers
* Usage of libc on rust

## What is it and why do we need it?
Address Resolution Protocol is used to create a mapping between layer 2(Hardware Address) i.e. Mac Address and layer 3 Address(IP Address). Even though it is specifically used for IP. It is designed to be completely decoupled to the layer 3 protocol.

Switch is a layer 2 device and only understands hardware addresses and network applications work layer 3 onwards where you interact with IP/TCP and so on.

## Imagine a Scenario
You have a Raspberry Pi server in your home to store your files, how does your router(which has an integrated switch) know how we need to send/receive packets from that particular machine when you type 192.168.29.3 on your browser.

## Role of a switch and mac addresses

Mac Address: It's a 6-byte hardware address on a device network interface card. First 3 bytes are vendor related and other 3 bytes are specific to device.

So your laptop's mac might look like Intel_c3:a9:7e
Vendor Bytes + UID

Switch is a device that works on routing packets based on mac addresses. A switch has ports where you connect your device to or Wireless. But the broadcast domain remains the same.

```
              +--------+
              | Switch |
              +---+----+
         _________|__________
        |         |          |
        v         v          v
  +----------+ +------------+ +--------+
  | Pi Server| | My PC      | | Other  |
  |          | | (btw Arch) | |  PC    |
  +----------+ +------------+ +--------+
```

A switch's job is to forward traffic between your local network based on the mac address and the port where it is connected to, it has zero knowledge about IP.

## How actual forwarding works
1. Ethernet packets contain the src and dest mac address(Somehow - We will tell about this in a bit)
2. The switch forwards the packet to the particular port.

## How ARP comes into picture and how we create the mappings of IP and mac.
1. For my Raspberry Pi to send cat images to my mobiles. It needs to know the local IP of my mobile and the mac address of my mobile.
2. For it to create a mapping it needs two steps. 1. A broadcast that says(Who has 192.168.29.3) 2. To reply(Intel_c3:a9:7e is at 192.168.29.3)


## Two steps of mapping IP to MAC address
![image](/images/arpwire_prod.png)
Step 1: Who(what hardware address) owns this protocol addresses(IP)
Step 2: I(hardware address) own this protocol address(IP).
### Do these steps happen always?
- Try it out on wireshark please?
#### Answer
- They do not. And the reason being every computer has a cache. Called the ARP table. It stores the responses of a ARP response on your machine.
- You can clear your ARP table and ping a machine in your local address or just call your default gateway to see how it works on wireshark.

## Coding our own host
### Responsibilities of a host
1. When you do not have a hardware address broadcast the need of knowing a hardware address.
2. When you get a broadcast request. Reply to it.
3. When you get a response to a broadcast, store it in your ARP table.
4. Somehow help the switch to know your presence so that it can update its internal mac table.

### host.rs and boot.rs
#### host.rs
##### Steps
1. Opens a socket.
2. Reads raw socket
3. TODO
#### boot.rs
##### Reason
To populate the mac table in the switch. On boot the host just sends an marker broadcast that it is present at a particular IP. This helps the switch and other host in the network to build a mac table or update the ARP tables.
##### Steps
1. On boot TODO
![image](/lebearp.png)
source: host.rs
### First experience with endianness
* While putting the protocol in the filter for the socket to read all ETH ARP requests I put the protocol directly into the socket and nothing ever logged.After spending some time, I figured it out that it was because of the little and big endianness. network bits are read in a little endian order and most architectures work on little endian.

## Coding our own switch

### Responsibilities of a switch
1. Know what mac addresses are connected to what interfaces.
2. Create a map of the interface ID and the mac address.
3. Be able to forward packages to particular ports by reading ethernet headers
4. Learn mac address and interface name passively.
#### Switch.rs
##### Reason

##### Steps



## Docker Networking Setup
### Topology
### Hosts
### Switch
