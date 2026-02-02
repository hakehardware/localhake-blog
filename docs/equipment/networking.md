---
title: Networking
sidebar_label: Networking
sidebar_position: 3
description: Network equipment — Ubiquiti UniFi router, switch, and access points
---

# Networking Equipment

The entire network stack is Ubiquiti UniFi, managed through the UDM Pro's built-in controller.

## Equipment

| Device | Model | Key Specs | IP | Role |
|--------|-------|-----------|-----|------|
| Router | Ubiquiti Dream Machine Pro | Router + firewall + UniFi controller | 10.1.10.1 (VLAN 10) | Routing, firewall, VLAN management, WireGuard VPN |
| Switch | USW Pro XG 8 PoE | 8-port 10G PoE | — | Core switch, 10G backbone |
| WiFi | UniFi Mesh AP | — | — | Wireless access |

## UDM Pro

The UDM Pro serves as the central hub:

- **Router** — handles all inter-VLAN routing
- **Firewall** — enforces DNS routing, IoT isolation, and blocks all inbound traffic
- **VLAN Management** — manages 5 VLANs (1, 10, 20, 30, 99)
- **VPN Server** — built-in WireGuard for remote access
- **UniFi Controller** — manages all UniFi devices from one interface

## USW Pro XG 8 PoE

The 10G switch provides high-throughput connectivity between hosts:

- 8 ports of 10G with PoE
- Tycho (NAS) connects at 10G for media streaming and backup throughput
- Other hosts connect at 2.5G

## Why UniFi?

- Single management interface for all networking
- Mature VLAN support
- Built-in WireGuard VPN (no separate VPN appliance)
- PoE for powering access points and potential future devices
- 10G backbone for NAS traffic

## Related Pages

- [VLANs](../network/vlans.md) — VLAN configuration
- [Firewall](../network/firewall.md) — firewall rules
- [Remote Access](../network/remote-access.md) — WireGuard VPN
