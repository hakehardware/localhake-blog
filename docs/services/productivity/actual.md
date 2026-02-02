---
title: Actual Budget
sidebar_label: Actual Budget
sidebar_position: 4
description: Self-hosted budgeting app — envelope-style budgeting
---

# Actual Budget

Self-hosted envelope-style budgeting application.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 117 |
| **IP** | 10.1.10.117 |
| **VLAN** | 10 |
| **Host** | eros |
| **Type** | LXC |
| **OS** | Debian 13 |
| **Port** | 5006 (HTTPS) |
| **URL** | `https://actual.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 2 |
| RAM | 2GB |
| Swap | 512MB |
| Disk | 4GB |

## Configuration

- Installed via Proxmox community helper script (Node.js 22 native install)
- Uses HTTPS on the upstream port (5006)

:::tip Caddy Note
Because Actual serves HTTPS on its upstream port, the Caddy reverse proxy config needs `transport http { tls_insecure_skip_verify }` to accept the self-signed certificate.
:::

## Installation

Installed via Proxmox community helper script.

## Related Pages

- [Eros](../../hosts/eros.md) — host details
- [Caddy](../infrastructure/caddy.md) — reverse proxy config note
