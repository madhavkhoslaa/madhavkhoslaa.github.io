---
title: "Projects & Open Source"
summary: "Things I have built, and upstream contributions: the Linux kernel, Ryoku and others."
aliases: ["/opensource/"]
---

## Open source

{{< collapse summary="**Linux kernel**" >}}
**selftests/bpf: Fix csum_partial() dropping trailing byte on odd length**: applied to `bpf-next` by Alexei Starovoitov on 2026-09-23 as commit [`ddaa827dcea4`](https://git.kernel.org/bpf/bpf-next/c/ddaa827dcea4).

`csum_partial()` in the BPF selftests summed only `len >> 1` 16-bit words, so it dropped the last byte of an odd-length buffer. RFC 1071 says that byte should be padded with zero and summed as one more word. The helper backs `build_ip_csum()`, `build_udp_v4_csum()` and `build_udp_v6_csum()`, which `flow_dissector_classification.c` and `xdp_metadata.c` use to hand-build packets.

| Version | Date | Tree | Status |
| --- | --- | --- | --- |
| [v1](https://lore.kernel.org/all/20260915145054.164857-1-madhav.khoslaa@gmail.com/) | 2026-09-15 | `bpf` | superseded |
| [v2](https://lore.kernel.org/all/20260916112554.413933-1-madhav.khoslaa@gmail.com/) | 2026-09-16 | `bpf` | superseded |
| [v3](https://lore.kernel.org/all/20260920085549.867099-1-madhav.khoslaa@gmail.com/) | 2026-09-20 | `bpf-next` | **applied** |
{{< /collapse >}}

{{< collapse summary="**Ryoku**" >}}
[Ryoku](https://github.com/Ryoku-dev/ryoku) is an Arch Linux desktop built on Hyprland/niri and Quickshell.

- [ryoku#436](https://github.com/Ryoku-dev/ryoku/pull/436): cli: quiet two false alarms in `ryoku update` (merged)
- [ryostore#106](https://github.com/Ryoku-dev/ryostore/pull/106): plugin: Keyboard Layouts, a layout per keyboard from the bar (merged)
- [ryostore#80](https://github.com/Ryoku-dev/ryostore/pull/80): plugin: Caffeinated (merged)
- [ryostore#136](https://github.com/Ryoku-dev/ryostore/pull/136): plugin: Docker (open)
{{< /collapse >}}

{{< collapse summary="**Vapour**" >}}
Public tooling for [Vapour](https://vapour.ink). See the project entry below.

- [vapour-cli](https://github.com/vapour-computer/vapour-cli/pulls?q=is%3Apr+author%3Amadhavkhoslaa): engine builds for Godot, Unity and Bevy, signed uploads, `vapour test`
- [vapour-profiler](https://github.com/vapour-computer/vapour-profiler/pulls?q=is%3Apr+author%3Amadhavkhoslaa): eBPF profiler, dashboard and JSON reports
- [vapour-dev-docs](https://github.com/vapour-computer/vapour-dev-docs/pulls?q=is%3Apr+author%3Amadhavkhoslaa): developer handbook and tutorials
{{< /collapse >}}

{{< collapse summary="**Earlier**" >}}
- [OpenMined/PySyft#1424](https://github.com/OpenMined/PySyft/pull/1424): basic class for pandas (merged, 2018)
{{< /collapse >}}

## Projects
