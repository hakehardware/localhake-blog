---
title: n8n
sidebar_label: n8n
sidebar_position: 2
description: Workflow automation platform — integrates with Ollama, Home Assistant, and other services
---

# n8n

Visual workflow automation platform. Connects services together and runs automated tasks, including LLM-powered workflows via Ollama.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 103 |
| **IP** | 10.1.10.103 |
| **VLAN** | 10 |
| **Host** | eros |
| **Type** | LXC |
| **OS** | Debian 13 |
| **Port** | 5678 |
| **URL** | `https://n8n.hake.rodeo` |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 2 |
| RAM | 8GB |
| Swap | 2GB |
| Disk | 10GB |

## Configuration

- Installed via Proxmox community helper script (Node.js 22 native install)
- Config: `/opt/n8n.env`
- Webhook URL: `https://n8n.hake.rodeo/`
- Licensed and activated ([your-n8n-license])

## Integrations

n8n can call any service with an API. Current integrations include:

- **[Ollama](../ai/ollama.md)** — LLM inference for workflow automations (llama3.3:70b)
- **[Home Assistant](./home-assistant.md)** — home automation triggers and actions
- Other services as needed via HTTP nodes

## Installation

Installed via Proxmox community helper script.

## Related Pages

- [Ollama](../ai/ollama.md) — LLM backend for n8n workflows
- [Home Assistant](./home-assistant.md) — home automation
- [Eros](../../hosts/eros.md) — host details
