---
title: Paperless-AI
sidebar_label: Paperless-AI
sidebar_position: 3
description: RAG document chat for Paperless-ngx — ask questions about your documents using local LLMs
---

# Paperless-AI

RAG (Retrieval-Augmented Generation) chat interface for Paperless-ngx. Ask questions about your documents using locally-running LLMs via Ollama.

## Overview

| Property | Value |
|----------|-------|
| **Host** | roci (10.1.10.13) |
| **Type** | Docker Compose |
| **Port** | 3001 |
| **URL** | `https://paperless-ai.hake.rodeo` |
| **Image** | `clusterzx/paperless-ai:latest` |
| **Compose File** | `~/paperless-ai/docker-compose.yml` |

## Resources

| Resource | Value |
|----------|-------|
| RAM | ~2GB base (models loaded via Ollama) |

## LLM Configuration

| Property | Value |
|----------|-------|
| Provider | Ollama (local) |
| Model | llama3.3:70b |
| Auto-processing | Disabled — RAG chat only |

Unlike [Paperless-GPT](./paperless-gpt.md) which uses Claude for tagging, Paperless-AI uses the local Ollama instance for conversational document queries.

## Configuration

- Web-based setup at `/setup`
- Document indexing runs on a 30-minute cron
- Restart the container after config changes to rebuild the RAG index

## Use Case

Paperless-AI is for *asking questions about your documents* — for example:

- "When does my car insurance expire?"
- "What was the total on my last electric bill?"
- "Find all documents from [correspondent]"

It indexes all documents in Paperless-ngx and uses RAG to provide answers grounded in your actual document content.

## Related Pages

- [Paperless-ngx](../productivity/paperless.md) — the document management system
- [Paperless-GPT](./paperless-gpt.md) — Claude-powered tagging (separate from RAG chat)
- [Ollama](./ollama.md) — local LLM backend
- [Roci](../../hosts/roci.md) — host details
