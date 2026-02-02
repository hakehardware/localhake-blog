---
title: Navidrome
sidebar_label: Navidrome
sidebar_position: 2
description: Self-hosted music streaming server with Subsonic API compatibility
---

# Navidrome

Lightweight music streaming server with Subsonic API support.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 105 |
| **IP** | 10.1.10.105 |
| **VLAN** | 10 |
| **Host** | tycho |
| **Type** | LXC |
| **OS** | Debian 13 |
| **Port** | 4533 |
| **URL** | `https://music.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 2 |
| RAM | 1GB |
| Swap | 1GB |
| Disk | 8GB |

## Storage Mounts

| Container Path | Host Path | Access |
|----------------|-----------|--------|
| `/music` | hdd-pool/media/music | Read-only |

## Client Apps

- **iOS**: play:Sub (Subsonic-compatible, [your-app-store-purchase])
- **Web**: Navidrome built-in web UI at `music.hake.rodeo`

Navidrome is Subsonic API compatible, so any Subsonic client works.

## Installation

Installed via Proxmox community helper script. Music folder configured at `/music`.

## Related Pages

- [Media Pipeline](./media-pipeline.md) — how music arrives
- [Tycho](../../hosts/tycho.md) — host details
