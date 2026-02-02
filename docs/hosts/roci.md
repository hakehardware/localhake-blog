---
title: Roci
sidebar_label: Roci
sidebar_position: 5
description: Local AI host — AMD Ryzen AI Max+ 395 with 128GB unified memory running Ollama and document AI services
---

# Roci (10.1.10.13)

The dedicated AI inference machine. Runs Ubuntu Server (not Proxmox) with ROCm for GPU-accelerated LLM inference.

## Hardware

| Component | Details |
|-----------|---------|
| **Type** | GMKtec EVO-X2 |
| **CPU** | AMD Ryzen AI Max+ 395 (16C/32T, up to 5.1GHz, Zen 5) |
| **RAM** | 128GB LPDDR5X 8000MHz (unified — shared between CPU and GPU) |
| **GPU** | Radeon 8060S iGPU (gfx1151) — roughly equivalent to an RTX 4060 |
| **NPU** | XDNA 2 (126 TOPS total AI performance) |
| **Storage** | 2TB PCIe 4.0 SSD |
| **NIC** | WiFi 7, USB4 |
| **OS** | Ubuntu Server 24.04 |

:::info
The 128GB is unified memory shared between CPU and GPU. The Radeon 8060S iGPU reports only 1GB VRAM but has access to 115GB of GTT (Graphics Translation Table) memory. This allows running 70B+ parameter models that would typically require a high-end discrete GPU.
:::

## GPU / ROCm Setup

| Property | Value |
|----------|-------|
| ROCm Version | 7.1 |
| GPU Target | gfx1151 |
| Environment | `HSA_OVERRIDE_GFX_VERSION=11.5.1` |
| TTM Pages | 115GB (configured via `amd-ttm` script) |

ROCm is installed via the [AMD Radeon install guide](https://rocm.docs.amd.com/projects/radeon-ryzen/en/latest/docs/install/installrad/native_linux/install-radeon.html).

## Services

| Service | Type | Port | Purpose |
|---------|------|:----:|---------|
| [Ollama](../services/ai/ollama.md) | systemd (ROCm) | 11434 | Local LLM inference |
| [Paperless-GPT](../services/ai/paperless-gpt.md) | Docker Compose | 8080 | Claude-powered document tagging |
| [Paperless-AI](../services/ai/paperless-ai.md) | Docker Compose | 3001 | RAG document chat |

### Current Models

| Model | Size | Use Case |
|-------|------|----------|
| llama3.3:70b | ~43GB | Paperless-AI RAG chat, n8n workflow automations |

The 128GB unified memory makes 70B+ parameter models practical — the model loads into GTT memory accessible by the iGPU for accelerated inference.

## Backup

Roci is not a Proxmox host, so it uses `proxmox-backup-client` with a systemd timer to back up to PBS:

| Data | Source Path |
|------|------------|
| paperless-gpt | `~/paperless-gpt` |
| paperless-ai | `~/paperless-ai` |
| Docker volumes | `/var/lib/docker/volumes` |
| System config | `/etc` |

- Runs daily at 06:00 (after all PVE backups complete)
- Docker containers are paused during backup, then resumed

## Related Pages

- [Ollama](../services/ai/ollama.md) — LLM inference service
- [Paperless-GPT](../services/ai/paperless-gpt.md) — auto-tagging
- [Paperless-AI](../services/ai/paperless-ai.md) — RAG chat
- [PBS](./pbs.md) — backup schedule
