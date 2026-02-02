---
title: Pi-hole + Unbound
sidebar_label: Pi-hole
sidebar_position: 1
description: DNS ad-blocking with Pi-hole and recursive DNS resolution with Unbound
---

# Pi-hole + Unbound

Network-wide DNS ad-blocking with recursive DNS resolution. Firewall rules intercept all outbound DNS traffic and redirect it here — even from devices with hardcoded DNS servers. Lives on its own VLAN (99) for additional isolation.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 100 |
| **IP** | 10.1.99.100 |
| **VLAN** | 99 |
| **Host** | ceres |
| **Type** | LXC |
| **OS** | Debian 13 |
| **URL** | `https://pihole.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 1 |
| RAM | 512MB |
| Swap | 512MB |
| Disk | 2GB |

## What It Does

- **Pi-hole** blocks ads and trackers at the DNS level for every device on every VLAN
- **Unbound** resolves DNS recursively from root servers — no upstream DNS provider (Google, Cloudflare, etc.)
- All VLANs have their DNS forced through Pi-hole via [firewall rules](../../network/firewall.md)

## Installation

Installed via Proxmox community helper script with Unbound included.

## Why VLAN 99?

A UniFi NAT policy intercepts all outbound port 53 traffic and redirects it to Pi-hole — catching naughty devices with hardcoded DNS (smart TVs, IoT devices trying to use `8.8.8.8`, etc.). Having Pi-hole on a dedicated VLAN makes this policy cleaner and also prevents any rogue device from impersonating a DNS server on the local network.

See [DNS](../../network/dns.md) for the full architecture.

## Related Pages

- [DNS](../../network/dns.md) — DNS architecture and VLAN isolation
- [Firewall](../../network/firewall.md) — DNS enforcement rules
- [Ceres](../../hosts/ceres.md) — host details
