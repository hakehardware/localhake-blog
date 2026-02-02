---
title: Eros
sidebar_label: Eros
sidebar_position: 3
description: Home automation and productivity host — Home Assistant, n8n, Mealie, Actual Budget
---

# Eros (10.1.10.11)

Home automation, productivity apps, and workflow automation.

## Hardware

| Component | Details |
|-----------|---------|
| **Type** | Mini PC |
| **CPU** | Intel 12450H (10 cores) |
| **RAM** | 64GB |
| **Storage** | 2TB NVMe |
| **NIC** | 2.5G |
| **OS** | Proxmox VE |

## Containers

| VMID | IP | Hostname | Service | Type | vCPU | RAM |
|:----:|----|----------|---------|------|:----:|:---:|
| 103 | 10.1.10.103 | n8n | [n8n](../services/automation/n8n.md) | LXC | 2 | 8GB |
| 115 | 10.1.10.115 | mealie | [Mealie](../services/productivity/mealie.md) | LXC | 2 | 3GB |
| 117 | 10.1.10.117 | actual | [Actual Budget](../services/productivity/actual.md) | LXC | 2 | 2GB |

## Virtual Machines

| VMID | IP | Hostname | Service | vCPU | RAM | Disk |
|:----:|----|----------|---------|:----:|:---:|:----:|
| 200 | 10.1.10.200 | haos | [Home Assistant OS](../services/automation/home-assistant.md) | 4 | 8GB | 32GB |

**Totals:** 12 vCPU, ~21.5GB RAM allocated

## Notes

- Home Assistant requires a full VM (HAOS needs its own OS). May need USB passthrough for Zigbee/Z-Wave sticks in the future.
- n8n is the largest consumer here at 8GB RAM — it handles workflow automations that integrate with Ollama and other services.
- All containers and VMs are backed up daily to [PBS](./pbs.md) at 03:00.

### Backup Hook Script

Eros runs a vzdump hook script at `/usr/local/bin/vzdump-hook.sh` that stops database services before snapshots:

- **n8n (VMID 103)**: n8n service stopped during `backup-start`, restarted at `backup-end`
- Service downtime is only ~20–30 seconds (snapshot creation time, not the full backup)

## Related Pages

- [Home Assistant](../services/automation/home-assistant.md)
- [n8n](../services/automation/n8n.md)
- [PBS](./pbs.md) — backup schedule
