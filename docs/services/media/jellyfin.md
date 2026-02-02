---
title: Jellyfin
sidebar_label: Jellyfin
sidebar_position: 1
description: Self-hosted video streaming for movies and TV with Intel QuickSync hardware transcoding
---

# Jellyfin

Open-source media server for movies and TV shows with hardware-accelerated transcoding.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 104 |
| **IP** | 10.1.10.104 |
| **VLAN** | 10 |
| **Host** | tycho |
| **Type** | LXC |
| **OS** | Ubuntu 24.04 |
| **Port** | 8096 |
| **URL** | `https://jellyfin.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 2 |
| RAM | 2GB |
| Swap | 2GB |
| Disk | 16GB |
| GPU | Intel Iris Xe (QuickSync, auto-configured) |

## Storage Mounts

| Container Path | Host Path | Access |
|----------------|-----------|--------|
| `/media/movies` | hdd-pool/media/movies | Read-only |
| `/media/tv` | hdd-pool/media/tv | Read-only |

Media files are read-only — Jellyfin only needs to read, never write to the media library.

## Hardware Transcoding

Jellyfin uses Intel QuickSync (Iris Xe on the 1245U CPU) for hardware transcoding. GPU passthrough is auto-configured by the community helper script. Nesting is required for Ubuntu 24.04 LXC containers.

## Installation

Installed via Proxmox community helper script (native install, not Docker).

## How Media Gets Here

New content arrives automatically via the [media pipeline](./media-pipeline.md):

1. Seedbox downloads → Syncthing syncs to NAS
2. FileBot AMC sorts movies and TV into `/media/movies/` and `/media/tv/`
3. Jellyfin detects new files and adds them to the library

## Related Pages

- [Media Pipeline](./media-pipeline.md) — how content arrives
- [Tycho](../../hosts/tycho.md) — host details and storage layout
- [Navidrome](./navidrome.md) — music streaming (separate service)
