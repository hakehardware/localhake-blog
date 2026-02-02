---
title: Vaultwarden
sidebar_label: Vaultwarden
sidebar_position: 3
description: Self-hosted password manager compatible with Bitwarden clients
---

# Vaultwarden

Self-hosted password manager — a lightweight Bitwarden-compatible server written in Rust.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 109 |
| **IP** | 10.1.10.109 |
| **VLAN** | 10 |
| **Host** | ceres |
| **Type** | LXC |
| **OS** | Alpine 3.23 |
| **Port** | 8000 |
| **URL** | `https://vault.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 1 |
| RAM | 256MB |
| Swap | 256MB |
| Disk | 1GB |

## Configuration

- Installed via Proxmox community helper script (Alpine)
- `ROCKET_TLS` disabled — Caddy handles HTTPS termination
- Data stored at `/var/lib/vaultwarden/`

## Client Apps

- **iOS**: Bitwarden (official app, free) — compatible with Vaultwarden server
- **Browser**: Bitwarden browser extension, pointed at `vault.hake.rodeo`

## Backup

The entire container (including the vault database) is backed up daily to [PBS](../../hosts/pbs.md). The critical file is `/var/lib/vaultwarden/` which contains the encrypted vault database.

## Related Pages

- [Ceres](../../hosts/ceres.md) — host details
- [Caddy](./caddy.md) — reverse proxy handling HTTPS
