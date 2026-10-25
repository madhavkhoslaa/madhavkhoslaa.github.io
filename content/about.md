+++
title = "About"
description = "Systems engineer: Linux kernel, eBPF, networking."
date = "2019-02-28"
aliases = ["about-us","about-hugo","contact"]
author = "Madhav Khosla"
summary = "Systems engineer working on the Linux kernel, eBPF and networking. Previously backend at Trackk, HighLevel and BharatPe."
+++

Hey, I'm Madhav. I'm a systems engineer working close to the metal: the Linux kernel, eBPF and the networking stack.

## Now

Since August 2026 I've been freelancing and working through the Linux `mm`, `net` and eBPF subsystems in depth.

- **Upstream kernel.** My first patch is merged into `bpf-next`: a `selftests/bpf` fix where `csum_partial()` dropped the trailing byte on odd-length buffers. More patches are in progress.
- **[Kukri](https://github.com/madhavkhoslaa/kukri).** A Linux network ACL/firewall in Rust and eBPF, with XDP on ingress and TC on egress. MAC, IPv4/CIDR and TCP/UDP port filters are chained with BPF tail calls, so a disabled rule category costs nothing. A `libbpf-rs` control plane keeps maps in sync, and a `ratatui` TUI edits rules live.
- **[ARP from scratch](https://github.com/madhavkhoslaa/arp-from-scratch).** ARP over raw `AF_PACKET` sockets in C and Rust, with no networking libraries. I [wrote about it here](/posts/arpfromscratch/).

## Before

I spent five years building backend systems, mostly in payments and fintech. That work is why I care about systems today.

- **Trackk** (2026). I built a Rust market-data service that takes NSE UDP feeds for 13K+ instruments and turns them into candles. It pushes them to clients over a multithreaded TCP server in under 100ms end to end. I also built a Rust order management system with SL/SL-M triggers, and BSE IPO bidding over UPI.
- **HighLevel** (2024–2026). I owned the WhatsApp workflow infrastructure on Google Pub/Sub: up to 50M events a month and 1.7M messages a day. A lot of that job was fixing distributed race conditions, such as duplicate sends, lost updates and out-of-order processing.
- **BharatPe** (2022–2024). I worked on UPI payments: 55K+ transactions a day at sub-200ms latency. I integrated Unity Bank as a VPA handler. I also partitioned a 1B+ row MySQL transaction table, which cut queries from 15s to 200ms.
- **SDPlus.io** (2021–2022). I designed Trickle, an internal backend framework, and moved core APIs to GraphQL.

## Why systems

I've always focused on observability. Staring at traces between services, DB logs and throughput-versus-latency graphs, I kept wanting to know what happens one layer down. So now I'm going down there: syscalls, sockets, packets, and the kernel code that moves them.

This site is where I log what I learn.

## Elsewhere

- Code: [github.com/madhavkhoslaa](https://github.com/madhavkhoslaa)
- Work: [linkedin.com/in/madhavkhoslaa](https://www.linkedin.com/in/madhavkhoslaa/)
- Posts: [x.com/futexmaxxing](https://x.com/futexmaxxing)

Thanks
~ Madhav :)
