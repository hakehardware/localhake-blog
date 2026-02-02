---
title: Home Assistant
sidebar_label: Home Assistant
sidebar_position: 1
description: Home automation platform running as a full VM (Home Assistant OS)
---

# Home Assistant

Home automation platform for managing smart home devices and automations. Runs as a full VM (Home Assistant OS requires its own operating system).

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 200 |
| **IP** | 10.1.10.200 |
| **VLAN** | 10 |
| **Host** | eros |
| **Type** | VM |
| **OS** | Home Assistant OS |
| **Port** | 8123 |
| **URL** | `https://home.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 4 |
| RAM | 8GB |
| Disk | 32GB |

## Why a VM?

Home Assistant OS (HAOS) is a purpose-built operating system that manages its own supervisor, add-ons, and updates. It needs a full VM — it can't run in an LXC container.

Future plans may include USB passthrough for Zigbee/Z-Wave sticks.

## Backup

- Backed up daily to [PBS](../../hosts/pbs.md) at 03:00 (with all eros containers)
- HAOS also has its own built-in backup system for add-on and configuration snapshots

## Related Pages

- [n8n](./n8n.md) — workflow automation (integrates with Home Assistant)
- [Eros](../../hosts/eros.md) — host details
