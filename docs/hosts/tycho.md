---
title: Tycho
sidebar_label: Tycho
sidebar_position: 4
description: NAS and media host — UGREEN 6-bay NAS with ZFS, media streaming, photo management, and document processing
---

# Tycho (10.1.10.12)

The storage and media powerhouse. All media apps run directly on tycho to avoid network file transfer overhead — data stays local to the disks.

## Hardware

| Component | Details |
|-----------|---------|
| **Type** | UGREEN 6-Bay NAS |
| **CPU** | Intel 1245U (10 cores) |
| **RAM** | 64GB |
| **Boot** | 128GB NVMe |
| **SSD Pool** | 2x 4TB NVMe (ZFS mirror, ~3.6TB usable) |
| **HDD Pool** | 6x 18TB HDD (ZFS RAIDZ2, ~65TB usable) |
| **NIC** | 10G |
| **OS** | Proxmox VE |
| **GPU** | Intel Iris Xe (1245U, for Jellyfin hardware transcoding) |

## Storage Architecture

### ZFS Pools

| Pool | Drives | Type | Usable | Purpose |
|------|--------|------|--------|---------|
| ssd-pool | 2x 4TB NVMe | Mirror | ~3.6TB | Databases, appdata, caches (fast I/O) |
| hdd-pool | 6x 18TB HDD | RAIDZ2 | ~65TB | Bulk storage — media, photos, documents |

The 128GB NVMe is used for Proxmox OS, VM disks, and container root filesystems (not ZFS).

### ZFS Dataset Layout

```
ssd-pool/
├── databases/               # Postgres, Redis, etc.
├── appdata/                 # App working directories
│   ├── audiobookshelf/
│   ├── paperless/
│   └── jellyfin/
└── immich-cache/            # Immich thumbnails and ML cache

hdd-pool/
├── media/
│   ├── movies/              → Jellyfin
│   ├── tv/                  → Jellyfin
│   ├── music/               → Navidrome
│   ├── audiobooks/          → Audiobookshelf
│   └── ebooks/              → Kavita
├── downloads/               ← Syncthing receives from seedbox
├── photos/                  → Immich originals
├── documents/               → Paperless-ngx consumption + archive
│   ├── consume/             ← Scanner intake via Samba
│   └── archive/             ← Processed documents
├── family/                  → Samba personal file shares
├── backups/                 # Local backup copies
└── personal/                # Files synced offsite via Syncthing → Mac → Backblaze
```

### Storage Access Methods

| Access Type | Method | Use Case |
|-------------|--------|----------|
| Local containers | Bind mount | Jellyfin, Immich, etc. running on tycho |
| Cross-host | NFS export | If ceres/eros containers need NAS access |
| Mac/Windows | SMB (via [Samba](../services/productivity/samba.md)) | Personal file access |

## Containers

| VMID | IP | Hostname | Service | vCPU | RAM |
|:----:|----|----------|---------|:----:|:---:|
| 102 | 10.1.10.102 | samba | [Samba](../services/productivity/samba.md) | 1 | 512MB |
| 104 | 10.1.10.104 | jellyfin | [Jellyfin](../services/media/jellyfin.md) | 2 | 2GB |
| 105 | 10.1.10.105 | navidrome | [Navidrome](../services/media/navidrome.md) | 2 | 1GB |
| 106 | 10.1.10.106 | audiobookshelf | [Audiobookshelf](../services/media/audiobookshelf.md) | 2 | 2GB |
| 107 | 10.1.10.107 | kavita | [Kavita](../services/media/kavita.md) | 1 | 1GB |
| 108 | 10.1.10.108 | syncthing | Syncthing | 1 | 256MB |
| 113 | 10.1.10.113 | immich | [Immich](../services/productivity/immich.md) | 4 | 8GB |
| 114 | 10.1.10.114 | paperless | [Paperless-ngx](../services/productivity/paperless.md) | 2 | 8GB |
| 119 | 10.1.10.119 | filebot | FileBot | 2 | 4GB |

**Totals:** 14 vCPU, ~15.5GB RAM allocated (out of 64GB)

## Notes

- All media services run on tycho to keep I/O local — no NFS overhead for media streaming
- Jellyfin uses Intel QuickSync (Iris Xe on the 1245U) for hardware transcoding
- FileBot AMC runs on a 30-minute cron to auto-sort movies, TV, and music; rsync runs hourly for audiobooks and ebooks
- All containers backed up daily to [PBS](./pbs.md) at 05:00

### Backup Hook Script

Tycho runs a vzdump hook script at `/usr/local/bin/vzdump-hook.sh` that stops database services before snapshots:

- **Immich (VMID 113)**: `immich-web` and `immich-ml` stopped
- **Paperless (VMID 114)**: `paperless-webserver`, `paperless-consumer`, `paperless-task-queue`, `paperless-scheduler` stopped

Services restart automatically after the snapshot completes (~20–30 seconds of downtime).

## Related Pages

- [Media Pipeline](../services/media/media-pipeline.md) — how media flows from seedbox to streaming
- [Storage](../equipment/storage.md) — drive specs and capacity details
- [PBS](./pbs.md) — backup schedule
