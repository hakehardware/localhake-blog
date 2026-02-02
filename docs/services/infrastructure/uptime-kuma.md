---
title: Uptime Kuma
sidebar_label: Uptime Kuma
sidebar_position: 4
description: Service monitoring dashboard with notifications via Pushover
---

# Uptime Kuma

Monitors all homelab services and sends alerts via Pushover when something goes down.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 111 |
| **IP** | 10.1.10.111 |
| **VLAN** | 10 |
| **Host** | ceres |
| **Type** | LXC |
| **OS** | Debian 13 |
| **Port** | 3001 |
| **URL** | `https://uptime.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 1 |
| RAM | 1GB |
| Swap | 512MB |
| Disk | 4GB |

## Configuration

- Installed via Proxmox community helper script
- Uses SQLite database
- Notifications via **Pushover** (requires [your-pushover-subscription])

## Monitoring Strategy

Uptime Kuma monitors HTTP endpoints for web services and TCP ports for non-HTTP services:

- **HTTP services**: Checks the `*.hake.rodeo` URLs through Caddy
- **TCP services**: e.g., Samba on port 445 (no HTTP interface)

## Related Pages

- [Ceres](../../hosts/ceres.md) — host details
- [Services catalog](../index.md) — all monitored services
