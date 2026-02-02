---
title: VLANs
sidebar_label: VLANs
sidebar_position: 2
description: VLAN configuration — subnets, purposes, and what lives on each network segment
---

# VLANs

The network is segmented into five VLANs. The VLAN ID maps directly to the third octet of the subnet (e.g., VLAN 10 = `10.1.10.x`).

## VLAN Summary

| VLAN ID | Subnet | Name | Purpose |
|:-------:|--------|------|---------|
| 1 | 192.168.1.x | Default | WiFi — personal devices, hands-off network |
| 10 | 10.1.10.x | localhake | All homelab infrastructure — Proxmox hosts, LXCs, VMs |
| 20 | 10.1.20.x | lab | YouTube/testing lab Proxmox hosts |
| 30 | 10.1.30.x | unsecure | Untrusted smart home and IoT devices |
| 99 | 10.1.99.x | pihole | Isolated DNS — Pi-hole + Unbound only |

## VLAN 1 — Default (WiFi)

The default network for everyday WiFi devices. This network is intentionally left simple and separate from the homelab.

- Subnet: `192.168.1.x`
- Gateway: `192.168.1.1`
- DNS: Routes to Pi-hole (10.1.99.100)

## VLAN 10 — Homelab

The primary VLAN where all homelab infrastructure lives. See [IP Strategy](../overview/ip-strategy.md) for the full address map.

- Subnet: `10.1.10.x`
- Gateway: `10.1.10.1`

| Range | Purpose |
|-------|---------|
| .10–.19 | Physical Proxmox hosts |
| .100–.199 | LXC containers |
| .200–.255 | Virtual machines |

### What Lives Here

- 5 physical hosts (ceres, eros, tycho, roci, pbs)
- 18 LXC containers
- 1 VM (Home Assistant OS)
- Caddy reverse proxy providing `*.hake.rodeo` internal domains

## VLAN 20 — Lab

A separate VLAN for testing and YouTube content creation. Allows experimentation without risk to production services.

- Subnet: `10.1.20.x`
- Gateway: `10.1.20.1`
- DNS: Routes to Pi-hole

## VLAN 30 — Unsecure (IoT)

Isolated network for untrusted smart home devices. These devices can reach the internet but cannot communicate with other VLANs.

- Subnet: `10.1.30.x`
- Gateway: `10.1.30.1`
- DNS: Routes to Pi-hole
- Firewall: **Blocked from reaching VLANs 1, 10, 20, and 99**

:::warning
IoT devices are deliberately untrusted. Many phone home, have poor security practices, or ship with hardcoded credentials. Isolating them on their own VLAN prevents a compromised device from accessing the rest of the network.
:::

## VLAN 99 — DNS

A dedicated VLAN for DNS services. Pi-hole and Unbound live here in isolation. Firewall NAT rules intercept all outbound DNS (port 53) from every VLAN and redirect it to Pi-hole — this overrides hardcoded DNS on devices like smart TVs. The dedicated VLAN adds a second layer by preventing any rogue device from impersonating a DNS server on the local network.

- Subnet: `10.1.99.x`
- Gateway: `10.1.99.1`
- Only service: Pi-hole + Unbound (10.1.99.100)

Why a separate VLAN for DNS? See [DNS](./dns.md) and [Firewall](./firewall.md) for the full rationale.

## Related Pages

- [IP Strategy](../overview/ip-strategy.md) — full IP address map
- [Firewall](./firewall.md) — inter-VLAN rules
- [DNS](./dns.md) — how DNS routing works across VLANs
