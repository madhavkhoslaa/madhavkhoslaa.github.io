---
title: "Kukri"
date: 2026-09-21
summary: "A Linux network ACL/firewall in Rust and eBPF."
content:
  format: "project"
  status: "active"
---
A Linux network ACL/firewall. eBPF programs run on XDP ingress and TC egress, and a Rust control plane (`libbpf-rs`) drives them. A `ratatui` terminal UI edits rules live.

MAC, IPv4/CIDR and TCP/UDP port filters are chained with BPF prog-array tail calls. Each rule category toggles at runtime, with zero overhead when disabled. The userspace–kernel map-sync layer uses LPM tries and array/hash maps, with a JSON-schema-validated config.

Source: [github.com/madhavkhoslaa/kukri](https://github.com/madhavkhoslaa/kukri)
