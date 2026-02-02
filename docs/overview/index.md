---
title: Overview
sidebar_label: Overview
sidebar_position: 1
description: General overview of Hake's Homelab — goals, design philosophy, and how everything fits together
---

# Homelab Overview

Welcome to the documentation for Hake's Homelab. This wiki is a living reference for the entire self-hosted infrastructure powering the LocalHake YouTube channel and my personal services.

## Goals

- **Self-host everything locally** — no cloud dependencies for personal data
- **Media server** — movies, TV, music, audiobooks, and ebooks all streaming locally
- **Home automation** — smart home management with Home Assistant
- **Local AI** — run large language models on-premises for document processing and automation
- **VPN-only remote access** — nothing exposed to the internet
- **Document everything** — this wiki is the result

## Design Principles

1. **VMID = IP** — every container and VM's ID matches its IP last octet, so you always know the address
2. **Seedbox for acquisition, local for playback** — downloads happen remotely, organization and streaming happen at home
3. **Nothing exposed to the internet** — WireGuard VPN is the only way in from outside
4. **Single source of truth** — each piece of configuration lives in one place
5. **Keep it simple** — LXC containers for most workloads, VMs only when required

## Naming Convention

Hosts are named after locations from *The Expanse*:

| Host | Namesake | Role |
|------|----------|------|
| **ceres** | Ceres Station | Core infrastructure services |
| **eros** | Eros Station | Home automation and productivity |
| **tycho** | Tycho Station | NAS and media services |
| **roci** | Rocinante | Local AI workloads |
| **pbs** (laconia) | Laconia | Backup server |

LXC containers and VMs are named after their service directly (e.g., `jellyfin`, `pihole`, `haos`).

## Documentation Sections

| Section | Description |
|---------|-------------|
| [Overview](/wiki/overview) | Goals, architecture, and IP strategy (you are here) |
| [Network](/wiki/network) | VLANs, DNS, reverse proxy, firewall, and remote access |
| [Hosts](/wiki/hosts) | Physical servers and what runs on each |
| [Equipment](/wiki/equipment) | Hardware specs, networking gear, and storage |
| [Services](/wiki/services) | Every self-hosted service documented individually |

:::tip
Looking for step-by-step tutorials? Check the [Blog](/blog) for detailed walkthroughs. This wiki is the reference for what's running and how it's configured.
:::
