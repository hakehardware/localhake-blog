---
title: Equipment
sidebar_label: Equipment
sidebar_position: 4
description: Hardware inventory — compute, networking, and storage equipment
---

# Equipment

All the physical hardware in the homelab — mini PCs, NAS, networking gear, and storage.

## At a Glance

| Category | Key Items |
|----------|-----------|
| [Compute](./compute.md) | 4 mini PCs + 1 UGREEN NAS + backup server |
| [Networking](./networking.md) | UDM Pro, USW Pro XG 8 PoE, UniFi Mesh AP |
| [Storage](./storage.md) | ~65TB HDD (RAIDZ2), ~3.6TB SSD (mirror), 8TB seedbox |

## Design Philosophy

The homelab runs entirely on mini PCs and a consumer NAS housed in a <AffiliateLink url="https://amzn.to/3O2NWQc" title="TecMojo 42U rack" />. No enterprise rack servers — just low-power, quiet hardware that keeps power consumption and noise minimal.

| Goal | Approach |
|------|----------|
| Low power | Mini PCs (~15–45W each) instead of rack servers |
| Low noise | Fanless or quiet fan designs |
| 10G backbone | USW Pro XG 8 PoE for high-throughput between hosts |
| Future expansion | Significant RAM and CPU headroom on all hosts |
