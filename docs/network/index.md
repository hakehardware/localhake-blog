---
title: Network
sidebar_label: Network
sidebar_position: 1
description: Network architecture overview — VLANs, subnets, and connectivity
---

# Network

The homelab network is built on Ubiquiti UniFi gear with VLAN segmentation to isolate different types of traffic.

## Quick Reference

| VLAN ID | Subnet | Name | Purpose |
|:-------:|--------|------|---------|
| 1 | 192.168.1.x | Default | WiFi network |
| 10 | 10.1.10.x | localhake | Proxmox hosts, services, all infrastructure |
| 20 | 10.1.20.x | lab | Testing and YouTube lab |
| 30 | 10.1.30.x | unsecure | Untrusted IoT/smart home devices |
| 99 | 10.1.99.x | pihole | Isolated DNS (Pi-hole + Unbound) |

## Network Equipment

| Device | Model | Role |
|--------|-------|------|
| Router | Ubiquiti Dream Machine Pro | Router, firewall, VLAN management, WireGuard VPN |
| Switch | USW Pro XG 8 PoE | 8-port 10G PoE switch |
| WiFi | UniFi Mesh AP | Wireless access |

## Key Design Decisions

- **All DNS is intercepted and redirected to Pi-hole** on VLAN 99 — even devices with hardcoded DNS servers get their requests hijacked by the firewall
- **IoT devices are isolated** — VLAN 30 can reach the internet but not other VLANs
- **Internal domains via Caddy** — all services accessible at `*.hake.rodeo` internally
- **No port forwarding** — nothing is exposed to the internet, period

## In This Section

| Page | Description |
|------|-------------|
| [VLANs](./vlans.md) | Detailed VLAN breakdown with what lives on each |
| [DNS](./dns.md) | Pi-hole + Unbound setup and DNS isolation |
| [Reverse Proxy](./reverse-proxy.md) | Caddy configuration and internal domain mapping |
| [Firewall](./firewall.md) | Firewall rules and inter-VLAN policies |
| [Remote Access](./remote-access.md) | WireGuard VPN and the no-exposure philosophy |
