---
title: Hosts
sidebar_label: Hosts
sidebar_position: 3
description: Physical servers and what runs on each — Proxmox hosts, AI box, and backup server
---

# Hosts

The homelab runs on five physical hosts: three standalone Proxmox VE nodes, a dedicated AI machine, and a backup server. Everything lives in a TecMojo 42U rack.

## Host Overview

| Host | IP | Hardware | CPU | RAM | Role |
|------|----|----------|-----|-----|------|
| [ceres](./ceres.md) | 10.1.10.10 | Mini PC | Intel 12450H | 64GB | Core services |
| [eros](./eros.md) | 10.1.10.11 | Mini PC | Intel 12450H | 64GB | Home automation + productivity |
| [tycho](./tycho.md) | 10.1.10.12 | UGREEN 6-Bay NAS | Intel 1245U | 64GB | NAS + media |
| [roci](./roci.md) | 10.1.10.13 | GMKtec EVO-X2 | AMD Ryzen AI Max+ 395 | 128GB | Local AI |
| [pbs](./pbs.md) | 10.1.10.16 | Mini PC | TBD | TBD | Backups |

## Proxmox Hosts

Ceres, eros, and tycho are three standalone Proxmox VE hosts on VLAN 10. They are **not** a Proxmox cluster — each host is managed independently with its own duties and storage. There's no shared management, live migration, or failover between them. For a homelab, the added complexity of clustering isn't worth it when each node has a clear, separate role.

Roci runs Ubuntu Server (not Proxmox) since it's dedicated to AI workloads with ROCm.

## VM/LXC Strategy

| Type | VMID Range | Use Case |
|------|:----------:|----------|
| LXC | 100–199 | Lightweight Linux services, Docker hosts, most workloads |
| VM | 200–255 | Full OS needed (HAOS), hardware passthrough, untrusted workloads |

**VMID = IP last octet** — always. See [IP Strategy](../overview/ip-strategy.md) for the full map.

### When to Use What

| Type | When to Use |
|------|------------|
| **LXC** | Simple services, single binary, native packages — the default choice |
| **LXC + Docker** | Complex apps with multiple components, official Docker images. Enable nesting + keyctl in Proxmox. |
| **VM** | Needs full OS (Home Assistant OS), hardware passthrough, or untrusted workloads |

## Resource Allocation

| Host | Allocated vCPU | Allocated RAM | Available RAM |
|------|:--------------:|:-------------:|:-------------:|
| ceres | 7 | ~6.5GB | ~57.5GB |
| eros | 12 | ~21.5GB | ~42.5GB |
| tycho | 14 | ~15.5GB | ~48.5GB |
| roci | — | ~68–100GB | ~28–60GB |

All hosts have significant headroom for growth.
