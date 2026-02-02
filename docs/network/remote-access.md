---
title: Remote Access
sidebar_label: Remote Access
sidebar_position: 6
description: WireGuard VPN setup for secure remote access — nothing exposed to the internet
---

# Remote Access

The homelab has zero services exposed to the internet. All remote access goes through WireGuard VPN built into the UDM Pro.

## Philosophy

**Nothing is port-forwarded. Nothing is exposed. No exceptions.**

When away from home, WireGuard VPN provides full access to the homelab as if on the local network. This means all `*.hake.rodeo` internal domains, Proxmox web UIs, and service dashboards work seamlessly over VPN.

## Setup

| Property | Value |
|----------|-------|
| VPN Protocol | WireGuard |
| VPN Server | UDM Pro (built-in) |
| Port Forwarding | None |
| Exposed Services | None |

## How It Works

1. **WireGuard server** runs on the UDM Pro
2. **Client devices** (phone, laptop) connect via WireGuard client app
3. Once connected, the device is on the homelab network with access to VLAN 10
4. All internal domains (`jellyfin.hake.rodeo`, `home.hake.rodeo`, etc.) resolve and work normally

## Use Cases

- **Traveling** — stream media from Jellyfin, check Home Assistant, manage services
- **Away from home** — access Vaultwarden, Paperless-ngx, Immich photos
- **Emergency management** — SSH into hosts, access Proxmox web UI

:::tip
WireGuard is lightweight enough to leave connected all the time on mobile devices with minimal battery impact. This gives you always-on access to your homelab services.
:::

## Related Pages

- [Reverse Proxy](./reverse-proxy.md) — internal domains that work over VPN
- [Firewall](./firewall.md) — why nothing is exposed
