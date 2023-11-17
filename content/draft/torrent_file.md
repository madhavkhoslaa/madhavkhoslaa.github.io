---
title: "Torrent: 1. How a .torrent file works"
draft: false
date: 2023-11-09T02:01:58+05:30
description: "All of us have downloaded torrent files and files using those torrent files, but probably most of us have not even opened a .torrent file and observe how it works"
tags: [Bittorrent, torrent]
---

![image](https://i.imgur.com/NQFCFTC.jpeg)

# Scope of this blog

To be able to understand what a torrent file does. What does contents inside torrent file do.

# How you download a torrent.

Say you were to download arch linux from the provided torrent file on the archlinux website. You would

1. Download the file from the website
2. load the file onto a torrent client like deluge/transmission/uTorrent etc and it begins downloading.

# Observing a torrent file

Let's disect the [Arch Linux Iso](https://archlinux.org/releng/releases/2023.11.01/torrent/) and open the file.

The file looks alot gibberish but you can see some ascii charecters like d,i,i with numbers next to them and maybe some urls.

this encoding of a file is called bencoding and it is a representation of a object similar to how yaml/json works.

now that we know that it is bencoded, we should know how bencoding works.

# Working of bencoding

# Opening torrent file in a bencoding viewer tool

this [tool](https://chocobo1.github.io/bencode_online/) helps us open a bencoded file and let's see it in JSON format.

Let's see the file in JSON which is more human readable format for an object.

```JSON
{
   "comment": "Arch Linux 2023.11.01 <https://archlinux.org>",
   "created by": "mktorrent 1.1",
   "creation date": 1698821953,
   "info": {
      "length": 846540800,
      "name": "archlinux-2023.11.01-x86_64.iso",
      "piece length": 524288,
      "pieces": "<hex>27 51 12 5C 1A DB 1B......Ommited for ease.....</hex>"
   },
   "url-list": [
      "https://mirror.aarnet.edu.au/pub/archlinux/iso/2023.11.01/",
      "https://mirrors.rit.edu/archlinux/iso/2023.11.01/",
      "https://ftp.ek-cer.hu/pub/mirrors/ftp.archlinux.org/iso/2023.11.01/",
      "https://ftp.heanet.ie/mirrors/ftp.archlinux.org/iso/2023.11.01/",
      "https://mirror.puzzle.ch/archlinux/iso/2023.11.01/",
      "https://mirror.csclub.uwaterloo.ca/archlinux/iso/2023.11.01/",
      .
      .
      .
      // Omitted for ease
      .
      .
      .
   ]
}
```
