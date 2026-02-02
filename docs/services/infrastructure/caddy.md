---
title: Caddy
sidebar_label: Caddy
sidebar_position: 2
description: Reverse proxy with automatic HTTPS via Cloudflare DNS challenge
---

# Caddy

Reverse proxy providing `*.hake.rodeo` internal domains with automatic HTTPS certificates.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 101 |
| **IP** | 10.1.10.101 |
| **VLAN** | 10 |
| **Host** | ceres |
| **Type** | LXC |
| **OS** | Debian 13 |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 1 |
| RAM | 512MB |
| Swap | 512MB |
| Disk | 6GB |

## How It Works

1. Built with **xcaddy** including the Cloudflare DNS module
2. Obtains wildcard certificates from Let's Encrypt via **DNS-01 challenge** through Cloudflare — no ports exposed to the internet
3. Pi-hole has local DNS entries pointing `*.hake.rodeo` → Caddy (10.1.10.101)
4. Caddy reverse-proxies each subdomain to the appropriate service IP

## Configuration

Caddy uses a Caddyfile with API-based configuration. Each service gets a subdomain entry that proxies to the service's internal IP and port.

:::tip
Some services (like Actual Budget) use HTTPS on their upstream port. For these, the Caddy config needs `transport http { tls_insecure_skip_verify }` to handle self-signed upstream certificates.
:::

## Installation

Installed via Proxmox community helper script with xcaddy + Cloudflare DNS module.

## Full Domain Map

See [Reverse Proxy](../../network/reverse-proxy.md) for the complete list of all `*.hake.rodeo` domains and their target IPs.

## Related Pages

- [Reverse Proxy](../../network/reverse-proxy.md) — full domain mapping
- [DNS](../../network/dns.md) — how local DNS points to Caddy
- [Ceres](../../hosts/ceres.md) — host details
