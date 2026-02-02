---
title: IP Strategy
sidebar_label: IP Strategy
sidebar_position: 3
description: How IP addresses and VMIDs are assigned across the homelab
---

# IP Strategy

Every IP address in the homelab follows a predictable convention. If you know a service's VMID, you know its IP — and vice versa.

## Core Convention

**VMID = IP last octet**

A container with VMID `104` has IP `10.1.10.104`. A VM with VMID `200` has IP `10.1.10.200`. No exceptions.

## VLAN-to-Subnet Mapping

The VLAN ID determines the third octet of the subnet:

| VLAN ID | Subnet | Purpose |
|:-------:|--------|---------|
| 1 | 192.168.1.x | WiFi (default network) |
| 10 | 10.1.10.x | Homelab (all infrastructure) |
| 20 | 10.1.20.x | Testing/Lab |
| 30 | 10.1.30.x | IoT (untrusted devices) |
| 99 | 10.1.99.x | DNS (isolated) |

## Reserved Ranges (per VLAN)

| Range | Purpose | Example |
|-------|---------|---------|
| `.1` | Gateway (UDM Pro) | 10.1.10.1 |
| `.10–.19` | Physical hosts | 10.1.10.10 (ceres) |
| `.20–.99` | Reserved for future use | — |
| `.100–.199` | LXC containers | 10.1.10.104 (jellyfin, VMID 104) |
| `.200–.255` | Virtual machines | 10.1.10.200 (haos, VMID 200) |

## Complete IP Map — VLAN 10 (Homelab)

### Physical Hosts

| IP | Hostname | Hardware |
|----|----------|----------|
| 10.1.10.10 | ceres | Mini PC (Intel 12450H, 64GB) |
| 10.1.10.11 | eros | Mini PC (Intel 12450H, 64GB) |
| 10.1.10.12 | tycho | UGREEN 6-Bay NAS (Intel 1245U, 64GB) |
| 10.1.10.13 | roci | GMKtec EVO-X2 (AMD Ryzen AI Max+ 395, 128GB) |
| 10.1.10.16 | pbs | Mini PC (Proxmox Backup Server) |

### LXC Containers (VMID 100–199)

| VMID | IP | Hostname | Host | Service |
|:----:|-----|----------|------|---------|
| 100 | 10.1.99.100 | pihole | ceres | Pi-hole + Unbound |
| 101 | 10.1.10.101 | caddy | ceres | Reverse proxy |
| 102 | 10.1.10.102 | samba | tycho | SMB file shares |
| 103 | 10.1.10.103 | n8n | eros | Workflow automation |
| 104 | 10.1.10.104 | jellyfin | tycho | Video streaming |
| 105 | 10.1.10.105 | navidrome | tycho | Music streaming |
| 106 | 10.1.10.106 | audiobookshelf | tycho | Audiobook streaming |
| 107 | 10.1.10.107 | kavita | tycho | Ebook reader |
| 108 | 10.1.10.108 | syncthing | tycho | File sync from seedbox |
| 109 | 10.1.10.109 | vaultwarden | ceres | Password manager |
| 111 | 10.1.10.111 | uptime-kuma | ceres | Service monitoring |
| 112 | 10.1.10.112 | homepage | ceres | Dashboard |
| 113 | 10.1.10.113 | immich | tycho | Photo management |
| 114 | 10.1.10.114 | paperless | tycho | Document management |
| 115 | 10.1.10.115 | mealie | eros | Recipe management |
| 116 | 10.1.10.116 | homer | ceres | Link dashboard |
| 117 | 10.1.10.117 | actual | eros | Budgeting |
| 119 | 10.1.10.119 | filebot | tycho | Media file organizer |

### Virtual Machines (VMID 200+)

| VMID | IP | Hostname | Host | Service |
|:----:|-----|----------|------|---------|
| 200 | 10.1.10.200 | haos | eros | Home Assistant OS |

:::tip
Need to find a service? Take its VMID and look at `10.1.10.{VMID}`. Need to find what's running on an IP? The last octet is the VMID — look it up in Proxmox.
:::

## Related Pages

- [VLANs](../network/vlans.md) — detailed VLAN configuration
- [Architecture](./architecture.md) — how it all connects
- [Hosts](../hosts/index.md) — what runs on each physical host
