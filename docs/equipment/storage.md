---
title: Storage
sidebar_label: Storage
sidebar_position: 4
description: Storage architecture — ZFS pools, drive inventory, capacity breakdown, and seedbox
---

# Storage

Storage is distributed across tycho (primary NAS), individual host drives, the PBS backup server, and a remote seedbox.

## Capacity Summary

| Location | Capacity | Type | Purpose |
|----------|----------|------|---------|
| tycho (hdd-pool) | ~65TB usable | 6x 18TB HDD, ZFS RAIDZ2 | Media, photos, documents, personal files |
| tycho (ssd-pool) | ~3.6TB usable | 2x 4TB NVMe, ZFS mirror | Databases, appdata, caches |
| tycho (boot) | ~119GB | 128GB NVMe | Proxmox OS, container rootfs |
| ceres | 1TB | NVMe | Core services |
| eros | 2TB | NVMe | Home automation, projects |
| roci | 2TB | PCIe 4.0 SSD | AI models (~50GB), Docker volumes |
| pbs (laconia) | 4TB | NVMe (ext4) | PBS backup datastore |
| Seedbox | 8TB | Remote | Download staging |

**Total local capacity:** ~78TB raw, ~72TB usable

## ZFS Configuration (Tycho)

### Pools

| Pool | Drives | Layout | Usable | Purpose |
|------|--------|--------|--------|---------|
| ssd-pool | 2x 4TB NVMe | Mirror | ~3.6TB | Fast I/O — databases, app working data, Immich cache |
| hdd-pool | 6x 18TB HDD | RAIDZ2 | ~65TB | Bulk storage — media, photos, documents |

RAIDZ2 can survive 2 simultaneous drive failures. The NVMe mirror can survive 1 drive failure.

### Dataset Layout

See [Tycho host page](../hosts/tycho.md) for the full ZFS dataset hierarchy and bind mount configuration.

## Seedbox Storage

| Property | Value |
|----------|-------|
| Provider | [your-seedbox-provider] |
| Capacity | 8TB |
| Purpose | Torrent downloads → Syncthing → NAS |

The seedbox is temporary staging only. Files sync to tycho via Syncthing, then qBittorrent auto-deletes after seeding for 14 days or reaching 1:1 ratio.

## What Gets Backed Up

| Data | Backed Up? | Method |
|------|:----------:|--------|
| VM/LXC snapshots | Yes | PBS (daily, all hosts) |
| roci Docker data | Yes | proxmox-backup-client to PBS |
| Documents, photos | Yes | Syncthing → Mac → Backblaze |
| Media (movies, TV) | No | Re-downloadable from seedbox |
| Music, audiobooks, ebooks | Partial | Consider backing up (harder to replace) |

## Related Pages

- [Tycho](../hosts/tycho.md) — ZFS datasets and container bind mounts
- [PBS](../hosts/pbs.md) — backup storage and retention
- [Media Pipeline](../services/media/media-pipeline.md) — seedbox to NAS flow
- [Compute](./compute.md) — host hardware specs
