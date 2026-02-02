---
title: Architecture
sidebar_label: Architecture
sidebar_position: 2
description: High-level architecture of the homelab — how hosts, VLANs, and services connect
---

# Architecture

This page covers how the homelab fits together at a high level — the network topology, service distribution across hosts, and how media flows from the internet to your screen.

## Network Topology

```mermaid
graph TD
    Internet["Internet"] --> UDM["UDM Pro (Router)"]
    UDM --> Switch["USW Pro XG 8 PoE (10G Switch)"]
    UDM --> WiFi["UniFi Mesh AP"]

    Switch --> ceres["ceres (10.1.10.10)\nCore Services"]
    Switch --> eros["eros (10.1.10.11)\nHome Automation"]
    Switch --> tycho["tycho (10.1.10.12)\nNAS + Media"]
    Switch --> roci["roci (10.1.10.13)\nLocal AI"]
    Switch --> pbs["pbs (10.1.10.16)\nBackups"]

    ceres --> pihole["Pi-hole + Unbound\n(10.1.99.100)"]
    ceres --> caddy["Caddy Reverse Proxy\n(10.1.10.101)"]

    Seedbox["Seedbox (Remote)"] -->|Syncthing| tycho
```

## Host Responsibilities

Each Proxmox host has a clear role:

| Host | Role | Key Services |
|------|------|-------------|
| **ceres** | Core infrastructure | Pi-hole, Caddy, Vaultwarden, Uptime Kuma, Homepage |
| **eros** | Home automation + productivity | Home Assistant, n8n, Mealie, Actual Budget |
| **tycho** | NAS + media | Jellyfin, Navidrome, Audiobookshelf, Kavita, Immich, Paperless-ngx, Syncthing, FileBot |
| **roci** | Local AI | Ollama, Paperless-GPT, Paperless-AI |
| **pbs** | Backups | Proxmox Backup Server |

## Service Dependencies

```mermaid
graph LR
    pihole["Pi-hole (DNS)"] --> AllServices["All Services"]
    caddy["Caddy (Reverse Proxy)"] --> jellyfin & navidrome & audiobookshelf & kavita & immich & paperless & pbs-ui["PBS UI"]

    subgraph "Media Pipeline"
        seedbox["Seedbox (qBittorrent)"] -->|Syncthing| syncthing["Syncthing (NAS)"]
        syncthing --> downloads["/downloads/"]
        downloads -->|"FileBot AMC (30 min)"| media["/media/ (movies, tv, music)"]
        downloads -->|"rsync (hourly)"| media2["/media/ (audiobooks, ebooks)"]
    end

    media --> jellyfin & navidrome
    media2 --> audiobookshelf & kavita
```

## Media Flow

The media pipeline is the most complex data flow in the homelab:

1. **Manually add torrent** to qBittorrent on seedbox (with category: movies, tv, music, etc.)
2. **qBittorrent downloads** to `~/downloads/qbittorrent/complete/{category}/`
3. **Syncthing syncs** completed files to tycho NAS at `/downloads/{category}/`
4. **FileBot AMC** runs every 30 minutes — auto-sorts movies, TV, and music into `/media/`
5. **rsync script** runs hourly — copies audiobooks and ebooks into `/media/`
6. **Streaming apps** (Jellyfin, Navidrome, Audiobookshelf, Kavita) pick up new content automatically
7. **qBittorrent seeds** for 14 days or 1:1 ratio, then auto-deletes

```
/media/
├── movies/         → Jellyfin
│   └── Movie Name (Year)/
├── tv/             → Jellyfin
│   └── Show Name/Season 01/
├── music/          → Navidrome
│   └── Artist/Album/
├── audiobooks/     → Audiobookshelf
│   └── Author/Book Title/
└── ebooks/         → Kavita
    └── Author/Book Title.epub
```

## Backup Flow

All Proxmox hosts back up to PBS nightly on a staggered schedule:

```mermaid
graph LR
    ceres -->|"01:00"| pbs["PBS (10.1.10.16)"]
    eros -->|"03:00"| pbs
    tycho -->|"05:00"| pbs
    roci -->|"06:00"| pbs
```

See [PBS host documentation](../hosts/pbs.md) for retention policies and disaster recovery.

## Related Pages

- [IP Strategy](./ip-strategy.md) — how IPs and VMIDs are assigned
- [VLANs](../network/vlans.md) — network segmentation details
- [Services](../services/index.md) — full service catalog
