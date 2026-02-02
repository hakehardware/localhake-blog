---
title: Homer
sidebar_label: Homer
sidebar_position: 6
description: Simple link dashboard for quick access to homelab services
---

# Homer

A simple, static link dashboard providing quick access to homelab services. Used as a clean landing page at `links.hake.rodeo`.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 116 |
| **IP** | 10.1.10.116 |
| **VLAN** | 10 |
| **Host** | ceres |
| **Type** | LXC |
| **OS** | Alpine |
| **Port** | 8010 |
| **URL** | `https://links.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 1 |
| RAM | 512MB |
| Swap | 512MB |
| Disk | 2GB |

## Configuration

Homer is configured entirely via a YAML file. It serves a static page with categorized links to all homelab services — no API integrations or widgets, just links.

## Homer vs Homepage

The homelab runs two dashboards:

| Dashboard | URL | Purpose |
|-----------|-----|---------|
| [Homepage](./homepage.md) | `homepage.hake.rodeo` | Full dashboard with widgets, service integrations, and stats |
| Homer | `links.hake.rodeo` | Simple link page for quick access — used as the default landing page |

## Related Pages

- [Homepage](./homepage.md) — the full-featured dashboard
- [Ceres](../../hosts/ceres.md) — host details
