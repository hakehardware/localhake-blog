---
title: Homepage
sidebar_label: Homepage
sidebar_position: 5
description: Homelab dashboard with widgets and service status
---

# Homepage

Full homelab dashboard with widgets, service integrations, and at-a-glance status.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 112 |
| **IP** | 10.1.10.112 |
| **VLAN** | 10 |
| **Host** | ceres |
| **Type** | LXC |
| **OS** | Debian 13 |
| **Port** | 3000 |
| **URL** | `https://homepage.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 2 |
| RAM | 4GB |
| Swap | 256MB |
| Disk | 6GB |

## Configuration

- Installed via Proxmox community helper script
- Config directory: `/opt/homepage/config/`
- `HOMEPAGE_ALLOWED_HOSTS` must include your domain in `/opt/homepage/.env`

## Notes

Homepage is the primary "landing page" for the homelab — it aggregates widgets and links to all services in one place. Homer (`links.hake.rodeo`, VMID 116) serves as a simpler link dashboard.

## Related Pages

- [Ceres](../../hosts/ceres.md) — host details
