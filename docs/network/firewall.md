---
title: Firewall
sidebar_label: Firewall
sidebar_position: 5
description: Firewall rules and inter-VLAN policies on the UDM Pro
---

# Firewall

Firewall rules are managed on the Ubiquiti Dream Machine Pro. The primary goals are DNS enforcement and IoT isolation.

## Rule Summary

### DNS Interception

A UniFi NAT policy intercepts all outbound DNS and forces it through Pi-hole — catching devices that ignore the DHCP-provided DNS and try to use their own hardcoded servers:

- **NAT redirect (DNAT)** — the UDM Pro listens on each VLAN for outbound port 53 (TCP/UDP) traffic. When a device tries to reach an external DNS server (e.g., a smart TV hardcoded to `8.8.8.8`), the policy silently redirects the request to Pi-hole (10.1.99.100). The device gets its DNS response and never knows it was intercepted.
- **Block** — as a fallback, outbound DNS (port 53 TCP/UDP) from all VLANs except VLAN 99 is dropped, catching anything the NAT rule doesn't cover.

:::note
This only catches standard DNS on port 53. DNS-over-HTTPS (port 443) and DNS-over-TLS (port 853) can bypass these rules. Blocking known public DoH/DoT servers is a further mitigation if needed.
:::

### IoT Isolation (VLAN 30)

- **Allow** VLAN 30 → Internet (outbound)
- **Allow** VLAN 30 → Pi-hole on VLAN 99 (DNS only)
- **Block** VLAN 30 → VLANs 1, 10, 20 (all other internal traffic)

IoT devices can reach the internet (for firmware updates, cloud services, etc.) but cannot access any other internal network.

### Homelab Access (VLAN 10)

- **Allow** VLAN 10 → all VLANs (full access for management)

The homelab VLAN has unrestricted access to all other VLANs for management and monitoring purposes.

### Default Policies

- **Inter-VLAN**: Deny by default (except explicitly allowed above)
- **Outbound**: Allow (all VLANs can reach the internet)
- **Inbound**: Deny all (nothing exposed)

## Why This Matters

Many IoT devices (smart bulbs, cameras, appliances) ship with poor security — hardcoded passwords, unpatched firmware, and phone-home behavior. The firewall ensures:

1. A compromised IoT device **cannot** pivot to the homelab network
2. Devices **cannot** bypass Pi-hole ad-blocking — even hardcoded DNS gets intercepted and redirected
3. The homelab VLAN **can** manage everything (Proxmox, SSH, web UIs)

## Related Pages

- [VLANs](./vlans.md) — network segmentation details
- [DNS](./dns.md) — why DNS is isolated on VLAN 99
- [Remote Access](./remote-access.md) — how external access works
