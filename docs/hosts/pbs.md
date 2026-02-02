---
title: PBS (Laconia)
sidebar_label: PBS
sidebar_position: 6
description: Proxmox Backup Server — central backup target, retention policies, and disaster recovery
---

# PBS / Laconia (10.1.10.16)

Central backup target for all Proxmox nodes and the roci AI host. Runs Proxmox Backup Server.

## Hardware

| Component | Details |
|-----------|---------|
| **Type** | Mini PC |
| **Storage** | 4TB NVMe (ext4 datastore) |
| **NIC** | 2.5G |
| **OS** | Proxmox Backup Server |

## Configuration

| Property | Value |
|----------|-------|
| IP | 10.1.10.16 |
| VLAN | 10 |
| Web UI Port | 8007 |
| URL | `https://pbs.hake.rodeo` |
| Datastore | `backups` → `/mnt/datastore/backups` (4TB NVMe, ext4) |
| Compression | ZSTD |
| Encryption | None (local-only, avoids key-loss risk) |

## Backup Schedule

Backups are staggered by 2 hours to prevent I/O overlap:

| Host | Time | Mode | Contents |
|------|:----:|------|----------|
| ceres | 01:00 | Snapshot | 6 LXC containers |
| eros | 03:00 | Snapshot | 3 LXC containers + 1 VM |
| tycho | 05:00 | Snapshot | 9 LXC containers |
| roci | 06:00 | proxmox-backup-client | Docker data, configs |

All backups use **snapshot mode** — no downtime. Containers/VMs continue running during backup. Eros and tycho run vzdump hook scripts to stop database services briefly (~20–30 seconds) during the snapshot freeze to prevent corruption.

## Retention Policy

Prune job runs daily at 08:00:

| Keep | Duration |
|------|----------|
| Last | 1 |
| Daily | 7 |
| Weekly | 4 |
| Monthly | 6 |

## Maintenance Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| Prune | Daily 08:00 | Apply retention policy, remove old backups |
| Garbage Collection | Saturday 10:00 | Reclaim disk space from pruned chunks |
| Verify | Daily | Verify new/unverified backups; full re-verify after 30 days |

## Estimated Storage Usage

| Host | Est. per Backup | With Dedup |
|------|:--------------:|:----------:|
| ceres | ~10–20GB | Much less |
| eros | ~15–30GB | Much less |
| tycho | ~20–40GB | Much less |
| roci | ~5–15GB | Much less |

PBS deduplication typically saves 50–80% after the initial backup.

## Disaster Recovery

### Recovery Priority

If everything needs to be rebuilt from scratch:

1. **Network** — UDM Pro, VLANs (manual, quick)
2. **PBS** — restore backup server first
3. **ceres** — Pi-hole (DNS), Caddy (proxy) — nothing works without these
4. **tycho** — Syncthing to start receiving media again
5. **eros** — Home Assistant, n8n
6. **roci** — Ollama, Paperless-GPT, Paperless-AI
7. **Seedbox** — qBittorrent + Syncthing configs

### Disaster Scenarios

| Scenario | Impact | Recovery |
|----------|--------|----------|
| Single LXC/VM dies | One service offline | Restore from PBS snapshot — minimal downtime |
| Single Proxmox host dies | Services on that host offline | Other hosts unaffected. Rebuild host, restore VMs from PBS. |
| NAS dies (catastrophic) | Media offline, photos/docs at risk | RAIDZ2 protects against 2-drive failure. Worst case: media re-downloadable from seedbox, ebooks/docs restore from PBS. |
| Total loss (fire, etc.) | Everything gone | GitHub has configs. Media is re-downloadable. Critical data needs offsite backup. |

:::warning
Offsite backup is not yet fully configured. Personal files sync to Mac via Syncthing and back up to Backblaze, but a full offsite PBS replication is on the TODO list.
:::

## Offsite Strategy (Current)

| Component | Solution |
|-----------|----------|
| Client | Syncthing: NAS → Mac (personal files) |
| Offsite | Backblaze Personal Backup (Mac) |
| What's covered | Documents, photos (Immich), important configs |
| **Not covered** | Media (re-downloadable), full PBS snapshots |

## Related Pages

- [Architecture](../overview/architecture.md) — backup flow diagram
- [Ceres](./ceres.md), [Eros](./eros.md), [Tycho](./tycho.md), [Roci](./roci.md) — what gets backed up
