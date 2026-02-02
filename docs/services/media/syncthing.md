---
title: Syncthing
sidebar_label: Syncthing
sidebar_position: 6
description: File sync between seedbox and NAS — receives completed downloads for local organization
---

# Syncthing

Continuous file synchronization between the remote seedbox and the local NAS. The NAS side receives completed downloads which are then organized by [FileBot](./filebot.md).

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 108 |
| **IP** | 10.1.10.108 |
| **VLAN** | 10 |
| **Host** | tycho |
| **Type** | LXC |
| **OS** | Alpine 3.23 |
| **Port** | 8384 |
| **URL** | `https://sync.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 1 |
| RAM | 256MB |
| Swap | 512MB |
| Disk | 1GB |

## Storage Mounts

| Container Path | Host Path | Access |
|----------------|-----------|--------|
| `/downloads` | hdd-pool/downloads | Read-write |

## Configuration

### NAS Side (this container)

| Setting | Value |
|---------|-------|
| Folder Type | Receive Only |
| Local Path | `/downloads` |

### Seedbox Side

| Setting | Value |
|---------|-------|
| Folder | `~/downloads/qbittorrent/complete` |
| Folder Type | Send Only |
| Watch for Changes | Disabled (provider fair usage policy) |
| Full Rescan Interval | 86400 seconds (24 hours) |

:::warning
Most seedbox providers have fair usage policies. Do **not** enable "Watch for Changes" or set fast rescan intervals. Use daily rescan (86400 seconds) minimum.
:::

### .stignore (seedbox)

```
// Don't sync incomplete/temp files
*.part
*.!qB
.DS_Store
```

## How It Fits In

Syncthing is step 3 in the [media pipeline](./media-pipeline.md):

1. qBittorrent downloads on seedbox
2. Files complete → land in `~/downloads/qbittorrent/complete/{category}/`
3. **Syncthing syncs to NAS** `/downloads/{category}/`
4. [FileBot](./filebot.md) sorts into `/media/`

To sync immediately instead of waiting for the daily rescan, open the Syncthing UI on the seedbox and click the shared folder → **Rescan**.

## Installation

Installed via Proxmox community helper script (Alpine).

## Related Pages

- [Media Pipeline](./media-pipeline.md) — full end-to-end flow
- [FileBot](./filebot.md) — organizes downloads after sync
- [Tycho](../../hosts/tycho.md) — host and storage details
