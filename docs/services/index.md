---
title: Services
sidebar_label: Services
sidebar_position: 5
description: Full catalog of self-hosted services — infrastructure, media, productivity, automation, and AI
---

# Services

Every self-hosted service running in the homelab, organized by function.

## Service Catalog

| Service | Host | VMID | IP | Category |
|---------|------|:----:|-----|----------|
| [Pi-hole + Unbound](./infrastructure/pihole.md) | ceres | 100 | 10.1.99.100 | Infrastructure |
| [Caddy](./infrastructure/caddy.md) | ceres | 101 | 10.1.10.101 | Infrastructure |
| [Vaultwarden](./infrastructure/vaultwarden.md) | ceres | 109 | 10.1.10.109 | Infrastructure |
| [Uptime Kuma](./infrastructure/uptime-kuma.md) | ceres | 111 | 10.1.10.111 | Infrastructure |
| [Homepage](./infrastructure/homepage.md) | ceres | 112 | 10.1.10.112 | Infrastructure |
| [Homer](./infrastructure/homer.md) | ceres | 116 | 10.1.10.116 | Infrastructure |
| [Samba](./productivity/samba.md) | tycho | 102 | 10.1.10.102 | Productivity |
| [n8n](./automation/n8n.md) | eros | 103 | 10.1.10.103 | Automation |
| [Jellyfin](./media/jellyfin.md) | tycho | 104 | 10.1.10.104 | Media |
| [Navidrome](./media/navidrome.md) | tycho | 105 | 10.1.10.105 | Media |
| [Audiobookshelf](./media/audiobookshelf.md) | tycho | 106 | 10.1.10.106 | Media |
| [Kavita](./media/kavita.md) | tycho | 107 | 10.1.10.107 | Media |
| [Syncthing](./media/syncthing.md) | tycho | 108 | 10.1.10.108 | Media |
| [FileBot](./media/filebot.md) | tycho | 119 | 10.1.10.119 | Media |
| [Immich](./productivity/immich.md) | tycho | 113 | 10.1.10.113 | Productivity |
| [Paperless-ngx](./productivity/paperless.md) | tycho | 114 | 10.1.10.114 | Productivity |
| [Mealie](./productivity/mealie.md) | eros | 115 | 10.1.10.115 | Productivity |
| [Actual Budget](./productivity/actual.md) | eros | 117 | 10.1.10.117 | Productivity |
| [Home Assistant](./automation/home-assistant.md) | eros | 200 | 10.1.10.200 | Automation |
| [Ollama](./ai/ollama.md) | roci | — | 10.1.10.13 | AI |
| [Paperless-GPT](./ai/paperless-gpt.md) | roci | — | 10.1.10.13 | AI |
| [Paperless-AI](./ai/paperless-ai.md) | roci | — | 10.1.10.13 | AI |

## Deployment Types

| Type | Description | Used By |
|------|-------------|---------|
| **LXC** | Service installed directly in container | Pi-hole, Caddy, Vaultwarden, most services |
| **LXC + Docker** | Docker engine inside LXC | Immich, Paperless-ngx |
| **VM** | Full virtual machine | Home Assistant OS |
| **Native (systemd)** | Installed directly on host OS | Ollama on roci |
| **Docker Compose** | Docker containers on host | Paperless-GPT, Paperless-AI on roci |

:::info
For LXC + Docker, enable **nesting** and **keyctl** in Proxmox LXC options.
:::

## Database Strategy

Each service runs its own database internally (per-service, Option A). This simplifies backups — PBS backs up the entire container including its database. Services using Postgres: n8n, Immich, Paperless-ngx, Mealie.
