---
title: Kavita
sidebar_label: Kavita
sidebar_position: 4
description: Self-hosted ebook reader with web and mobile interfaces
---

# Kavita

Self-hosted ebook reader and library manager. Replaces Calibre-Web.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 107 |
| **IP** | 10.1.10.107 |
| **VLAN** | 10 |
| **Host** | tycho |
| **Type** | LXC |
| **OS** | Debian 13 |
| **Port** | 5000 |
| **URL** | `https://kavita.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 1 |
| RAM | 1GB |
| Swap | 1GB |
| Disk | 8GB |

## Storage Mounts

| Container Path | Host Path | Access |
|----------------|-----------|--------|
| `/books` | hdd-pool/media/ebooks | Read-write |

## Installation

Installed via Proxmox community helper script (Kavita 0.8.9).

## Related Pages

- [Media Pipeline](./media-pipeline.md) — how ebooks arrive
- [Tycho](../../hosts/tycho.md) — host details
