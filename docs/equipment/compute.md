---
title: Compute
sidebar_label: Compute
sidebar_position: 2
description: Compute hardware — mini PCs, NAS, and AI workstation specs
---

# Compute Hardware

All homelab compute runs on mini PCs and a UGREEN NAS. No rack servers.

## Main Homelab

| Hostname | Hardware | CPU | RAM | Storage | NIC | Role |
|----------|----------|-----|-----|---------|-----|------|
| ceres | Mini PC | Intel 12450H | 64GB | 1TB NVMe | 2.5G | Core services |
| eros | Mini PC | Intel 12450H | 64GB | 2TB NVMe | 2.5G | Home automation + dev |
| tycho | UGREEN 6-Bay NAS | Intel 1245U | 64GB | 128GB NVMe (boot) + 2x4TB NVMe + 6x18TB HDD | 10G | NAS + media |
| roci | GMKtec EVO-X2 | AMD Ryzen AI Max+ 395 (16C/32T, Zen 5) | 128GB LPDDR5X 8000MHz | 2TB PCIe 4.0 SSD | WiFi 7, USB4 | Local AI |
| pbs (laconia) | Mini PC | TBD | TBD | 4TB NVMe (ext4 datastore) | 2.5G | Proxmox Backup Server |

## Notable Hardware

### GMKtec EVO-X2 (roci)

<AffiliateLink url="https://amzn.to/4arYWPQ" title="GMKtec EVO-X2 on Amazon" />

The standout piece of hardware in the homelab. The AMD Ryzen AI Max+ 395 has:

- **16 cores / 32 threads** at up to 5.1GHz (Zen 5)
- **128GB LPDDR5X 8000MHz** unified memory shared between CPU and GPU
- **Radeon 8060S iGPU** (gfx1151) — roughly equivalent to an RTX 4060
- **XDNA 2 NPU** — 126 TOPS total AI performance

This makes it capable of running 70B+ parameter LLMs locally. The 128GB unified memory is the key — it allows the iGPU to access ~115GB of GTT memory for model inference.

### UGREEN 6-Bay NAS (tycho)

<AffiliateLink url="https://amzn.to/4btT4GR" title="UGREEN NASync DXP6800 Plus on Amazon" /> (I have the Pro model with 1245U; the Plus with 1215U is similar)

A consumer NAS repurposed as a Proxmox host:

- **6 HDD bays** populated with 18TB drives in ZFS RAIDZ2 (~65TB usable)
- **2 NVMe slots** with 4TB drives in ZFS mirror (~3.6TB usable)
- **128GB NVMe** boot drive for Proxmox OS
- **10G NIC** for high-throughput to the switch
- **Intel 1245U** with Iris Xe for Jellyfin hardware transcoding (QuickSync)

## External Services

| Service | Provider | Specs | Purpose |
|---------|----------|-------|---------|
| Seedbox | [your-seedbox-provider] | 8TB storage | Torrent downloads + Syncthing to NAS |

## Related Pages

- [Hosts](../hosts/index.md) — what runs on each machine
- [Storage](./storage.md) — detailed drive and ZFS configuration
- [Networking](./networking.md) — how it's all connected
