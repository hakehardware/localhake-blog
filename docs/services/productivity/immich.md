---
title: Immich
sidebar_label: Immich
sidebar_position: 2
description: Self-hosted photo backup and management — Google Photos alternative
---

# Immich

Self-hosted photo and video backup platform — a Google Photos replacement.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 113 |
| **IP** | 10.1.10.113 |
| **VLAN** | 10 |
| **Host** | tycho |
| **Type** | LXC (with Docker) |
| **OS** | Debian 13 |
| **Port** | 2283 |
| **URL** | `https://images.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 4 |
| RAM | 8GB |
| Swap | 4GB |
| Disk | 16GB |

## Storage Mounts

| Container Path | Host Path | Access | Pool |
|----------------|-----------|--------|------|
| `/photos` | hdd-pool/photos | Read-write | HDD (bulk) |
| `/cache` | ssd-pool/immich-cache | Read-write | SSD (fast) |

Photo originals go to the HDD pool (large, slower). Thumbnails and ML cache go to the SSD pool (fast I/O for browsing performance).

## Configuration

- Installed via Proxmox community helper script
- ML (face recognition) disabled — not needed
- Upload location retargeted to `/photos` (HDD pool)
- Includes Postgres and Redis internally

## Client Apps

- **iOS**: Immich (official app, free)
- **Web**: `images.hake.rodeo`

## Backup

Photos are considered critical data:
- Container backed up daily to [PBS](../../hosts/pbs.md)
- Photo originals in hdd-pool/photos sync to Mac via Syncthing → Backblaze for offsite backup

## Related Pages

- [Tycho](../../hosts/tycho.md) — host and storage details
- [Storage](../../equipment/storage.md) — SSD vs HDD pool strategy
