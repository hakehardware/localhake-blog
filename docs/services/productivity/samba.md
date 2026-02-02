---
title: Samba
sidebar_label: Samba
sidebar_position: 5
description: SMB file shares for family storage and scanner document intake
---

# Samba

Network file shares (SMB/CIFS) for personal file storage and Paperless-ngx scanner intake.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 102 |
| **IP** | 10.1.10.102 |
| **VLAN** | 10 |
| **Host** | tycho |
| **Type** | LXC (manual setup) |
| **OS** | Debian 13 |
| **Port** | 445 |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 1 |
| RAM | 512MB |
| Swap | 512MB |
| Disk | 4GB |

## Storage Mounts

| Container Path | Host Path | Access | Purpose |
|----------------|-----------|--------|---------|
| `/shares/[user1]` | hdd-pool/family/[user1] | Read-write | Personal files |
| `/shares/[user2]` | hdd-pool/family/[user2] | Read-write | Personal files |
| `/shares/shared` | hdd-pool/family/shared | Read-write | Shared family files |
| `/shares/consume` | hdd-pool/documents/consume | Read-write | Scanner → Paperless-ngx intake |

## Shares

| Share | Purpose | Users |
|-------|---------|-------|
| Personal shares | Individual file storage per family member | [your-users] |
| shared | Shared family storage | All users |
| consume | Scanner document intake for [Paperless-ngx](./paperless.md) | Scanner device |

## How Scanner Intake Works

1. Brother scanner is configured to scan directly to the `consume` SMB share
2. Scanned documents land in `/shares/consume` (mapped to hdd-pool/documents/consume)
3. Paperless-ngx watches the same path and auto-imports new documents

## Notes

- SMB is not an HTTP service, so it doesn't go through Caddy or need a `*.hake.rodeo` domain
- Monitored via TCP port 445 in Uptime Kuma

## Related Pages

- [Paperless-ngx](./paperless.md) — document management (consumes from scanner share)
- [Tycho](../../hosts/tycho.md) — host and storage details
