---
title: "ARP Stack"
date: 2026-09-03
summary: "ARP from scratch over raw AF_PACKET sockets, in C and Rust."
content:
  format: "project"
  status: "complete"
---
ARP implemented from scratch over raw `AF_PACKET` sockets in promiscuous mode, with no networking libraries. It covers Ethernet frame parsing and construction, ARP request/reply handling, MAC resolution, the ARP cache, and packet transmission.

Write-up: [Writing ARP From Scratch and My Learnings](/posts/arpfromscratch/)

Source: [github.com/madhavkhoslaa/arp-from-scratch](https://github.com/madhavkhoslaa/arp-from-scratch)
