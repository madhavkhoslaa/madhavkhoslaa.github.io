---
title: "Vapour CLI and Profiler"
date: 2026-10-14
summary: "Go CLI to build and publish web games, and a local-first eBPF profiler."
content:
  format: "project"
  status: "active"
---
Tooling for [Vapour](https://vapour.ink), a platform for web games.

- **[vapour-cli](https://github.com/vapour-computer/vapour-cli)** (Go, MIT). Logs in, creates a game project, and builds and publishes web exports for Godot, Unity and Bevy. It scans and signs build zips, does chunked and delta uploads, and runs games locally with an FPS overlay (`vapour test`).
- **[vapour-profiler](https://github.com/vapour-computer/vapour-profiler)** (Rust, eBPF). A standalone, local-first eBPF profiler for Wasm runtimes and Linux processes. It uses CO-RE BPF attach/detach, and capture is explicit and bounded. It ships a local performance dashboard and per-asset load observability.
