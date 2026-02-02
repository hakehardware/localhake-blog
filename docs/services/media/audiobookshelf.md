---
title: Audiobookshelf
sidebar_label: Audiobookshelf
sidebar_position: 3
description: Self-hosted audiobook streaming with mobile app support
---

# Audiobookshelf

Audiobook and podcast streaming server with a dedicated mobile app.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 106 |
| **IP** | 10.1.10.106 |
| **VLAN** | 10 |
| **Host** | tycho |
| **Type** | LXC |
| **OS** | Debian 13 |
| **Port** | 13378 |
| **URL** | `https://audiobooks.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 2 |
| RAM | 2GB |
| Swap | 1GB |
| Disk | 5GB |

## Storage Mounts

| Container Path | Host Path | Access |
|----------------|-----------|--------|
| `/audiobooks` | hdd-pool/media/audiobooks | Read-write |

## Configuration

- Installed via Proxmox community helper script
- Metadata provider: Audible
- Mobile app: Audiobookshelf (iOS/Android)

## Related Pages

- [Media Pipeline](./media-pipeline.md) — how audiobooks arrive
- [Tycho](../../hosts/tycho.md) — host details
