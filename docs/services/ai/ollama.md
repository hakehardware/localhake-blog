---
title: Ollama
sidebar_label: Ollama
sidebar_position: 1
description: Local LLM inference with ROCm GPU acceleration — runs 70B+ parameter models
---

# Ollama

Local large language model (LLM) inference server. Runs on roci with ROCm GPU acceleration, serving 70B+ parameter models for document processing and workflow automation.

## Overview

| Property | Value |
|----------|-------|
| **Host** | roci (10.1.10.13) |
| **Type** | Native (systemd service) |
| **Port** | 11434 |
| **Version** | 0.15.2 |

## Current Models

| Model | Size | Use Case |
|-------|------|----------|
| llama3.3:70b | ~43GB | Paperless-AI RAG chat, n8n workflow automations |

The 128GB unified memory on roci makes 70B+ parameter models practical. The model loads into GTT memory accessible by the Radeon 8060S iGPU for accelerated inference.

## GPU Configuration

| Property | Value |
|----------|-------|
| GPU | Radeon 8060S iGPU (gfx1151) |
| ROCm | 7.1 |
| Environment | `HSA_OVERRIDE_GFX_VERSION=11.5.1` |
| GTT Memory | 115GB (configured via `amd-ttm` script) |
| Visible VRAM | 1GB (but 115GB GTT available for model loading) |

:::info
The Radeon 8060S reports only 1GB of VRAM, but it uses GTT (Graphics Translation Table) memory from the unified 128GB pool. The `amd-ttm` script configures 115GB of GTT pages, giving the GPU access to the vast majority of system memory for model inference.
:::

## Installation

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

ROCm installed via the [AMD Radeon install guide](https://rocm.docs.amd.com/projects/radeon-ryzen/en/latest/docs/install/installrad/native_linux/install-radeon.html).

## Who Uses Ollama

| Consumer | Model | Purpose |
|----------|-------|---------|
| [Paperless-AI](./paperless-ai.md) | llama3.3:70b | RAG document chat |
| [n8n](../automation/n8n.md) | llama3.3:70b | Workflow automations |

## Related Pages

- [Roci](../../hosts/roci.md) — host hardware and GPU details
- [Paperless-AI](./paperless-ai.md) — RAG chat using Ollama
- [n8n](../automation/n8n.md) — workflow automation using Ollama
