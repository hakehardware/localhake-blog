---
title: Ceres
sidebar_label: Ceres
sidebar_position: 2
description: Core infrastructure host — Pi-hole, Caddy, Vaultwarden, Uptime Kuma, Homepage, Homer
---

# Ceres (10.1.10.10)

Core infrastructure services. If ceres goes down, DNS and reverse proxy go with it — making it the most critical host in the homelab.

## Hardware

| Component | Details |
|-----------|---------|
| **Type** | Mini PC |
| **CPU** | Intel 12450H (10 cores) |
| **RAM** | 64GB |
| **Storage** | 1TB NVMe |
| **NIC** | 2.5G |
| **OS** | Proxmox VE |

## Containers

| VMID | IP | Hostname | Service | vCPU | RAM |
|:----:|----|----------|---------|:----:|:---:|
| 100 | 10.1.99.100 | pihole | [Pi-hole + Unbound](../services/infrastructure/pihole.md) | 1 | 512MB |
| 101 | 10.1.10.101 | caddy | [Caddy](../services/infrastructure/caddy.md) | 1 | 512MB |
| 109 | 10.1.10.109 | vaultwarden | [Vaultwarden](../services/infrastructure/vaultwarden.md) | 1 | 256MB |
| 111 | 10.1.10.111 | uptime-kuma | [Uptime Kuma](../services/infrastructure/uptime-kuma.md) | 1 | 1GB |
| 112 | 10.1.10.112 | homepage | [Homepage](../services/infrastructure/homepage.md) | 2 | 4GB |
| 116 | 10.1.10.116 | homer | Homer (link dashboard) | 1 | 512MB |

**Totals:** ~7 vCPU, ~6.5GB RAM allocated (plenty of headroom on 64GB)

## Notes

- No VMs — all workloads are lightweight LXC containers
- Homer is a simple link dashboard for quick access at `links.hake.rodeo`
- All containers are backed up daily to [PBS](./pbs.md) at 01:00
- No vzdump hook scripts needed — ceres has no database services that require pre-snapshot stops

## Related Pages

- [Pi-hole](../services/infrastructure/pihole.md) — DNS ad-blocking
- [Caddy](../services/infrastructure/caddy.md) — reverse proxy
- [PBS](./pbs.md) — backup schedule
