---
title: Reverse Proxy
sidebar_label: Reverse Proxy
sidebar_position: 4
description: Caddy reverse proxy setup with internal domains and automatic HTTPS
---

# Reverse Proxy

All HTTP services are accessed through Caddy, which provides internal domain names at `*.hake.rodeo` with automatic HTTPS via Let's Encrypt DNS challenge through Cloudflare.

## How It Works

1. **Cloudflare** manages the `hake.rodeo` domain DNS
2. **Caddy** runs on `10.1.10.101` with the Cloudflare DNS module (built via xcaddy)
3. **Let's Encrypt** issues wildcard certificates via DNS-01 challenge — no ports need to be open to the internet
4. **Pi-hole** has local DNS entries pointing `*.hake.rodeo` to Caddy's IP
5. Caddy reverse-proxies each subdomain to the appropriate service IP

:::info
Since certificates are issued via DNS challenge, the homelab remains completely unexposed to the internet. No port 80 or 443 forwarding required.
:::

## Domain Configuration

| Domain | Service | Target IP |
|--------|---------|-----------|
| `pihole.hake.rodeo` | Pi-hole | 10.1.99.100 |
| `vault.hake.rodeo` | Vaultwarden | 10.1.10.109 |
| `jellyfin.hake.rodeo` | Jellyfin | 10.1.10.104 |
| `music.hake.rodeo` | Navidrome | 10.1.10.105 |
| `audiobooks.hake.rodeo` | Audiobookshelf | 10.1.10.106 |
| `kavita.hake.rodeo` | Kavita | 10.1.10.107 |
| `images.hake.rodeo` | Immich | 10.1.10.113 |
| `docs.hake.rodeo` | Paperless-ngx | 10.1.10.114 |
| `meals.hake.rodeo` | Mealie | 10.1.10.115 |
| `n8n.hake.rodeo` | n8n | 10.1.10.103 |
| `actual.hake.rodeo` | Actual Budget | 10.1.10.117 |
| `home.hake.rodeo` | Home Assistant | 10.1.10.200 |
| `links.hake.rodeo` | Homer | 10.1.10.116 |
| `sync.hake.rodeo` | Syncthing | 10.1.10.108 |
| `uptime.hake.rodeo` | Uptime Kuma | 10.1.10.111 |
| `homepage.hake.rodeo` | Homepage | 10.1.10.112 |
| `ceres.hake.rodeo` | Proxmox (ceres) | 10.1.10.10 |
| `eros.hake.rodeo` | Proxmox (eros) | 10.1.10.11 |
| `tycho.hake.rodeo` | Proxmox (tycho) | 10.1.10.12 |
| `paperless-gpt.hake.rodeo` | Paperless-GPT | 10.1.10.13 |
| `paperless-ai.hake.rodeo` | Paperless-AI | 10.1.10.13 |
| `pbs.hake.rodeo` | Proxmox Backup Server | 10.1.10.16 |

## Key Details

| Property | Value |
|----------|-------|
| Domain | hake.rodeo |
| DNS Provider | Cloudflare |
| Certificates | Let's Encrypt (DNS-01 challenge) |
| Caddy Modules | xcaddy + Cloudflare DNS |

## Service Details

| Property | Value |
|----------|-------|
| Service | Caddy |
| VMID | 101 |
| IP | 10.1.10.101 |
| Host | ceres |
| Type | LXC |

See [Caddy service page](../services/infrastructure/caddy.md) for container specs and Caddyfile details.

## Related Pages

- [Caddy](../services/infrastructure/caddy.md) — service configuration
- [DNS](./dns.md) — how local DNS entries point to Caddy
- [Remote Access](./remote-access.md) — accessing these domains via VPN
