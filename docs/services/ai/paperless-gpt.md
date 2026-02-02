---
title: Paperless-GPT
sidebar_label: Paperless-GPT
sidebar_position: 2
description: Claude-powered auto-tagging, titling, and OCR for Paperless-ngx documents
---

# Paperless-GPT

Uses Anthropic Claude to automatically tag, title, assign correspondents, and classify documents in Paperless-ngx. Can also re-OCR poor scans using Claude's vision capabilities.

## Overview

| Property | Value |
|----------|-------|
| **Host** | roci (10.1.10.13) |
| **Type** | Docker Compose |
| **Port** | 8080 |
| **URL** | `https://paperless-gpt.hake.rodeo` |
| **Image** | `icereed/paperless-gpt:latest` |
| **Compose File** | `~/paperless-gpt/docker-compose.yml` |

## Resources

| Resource | Value |
|----------|-------|
| RAM | ~2GB base |

## LLM Provider

| Property | Value |
|----------|-------|
| Provider | Anthropic |
| Model | Claude Sonnet 4 |
| Vision/OCR | Claude Sonnet 4 |
| API Key | [your-anthropic-api-key] |

## How It Works

### Auto-Tagging Flow

1. New document arrives in [Paperless-ngx](../productivity/paperless.md)
2. Paperless workflow assigns tags: `paperless-gpt-auto` + `needs-review`
3. Paperless-GPT picks up documents tagged `paperless-gpt-auto`
4. Claude analyzes the document and assigns:
   - Title
   - Tags
   - Correspondent
   - Document type
5. `paperless-gpt-auto` tag is removed after processing

### Manual Tagging

Apply the `paperless-gpt` tag to any document for on-demand Claude processing.

### OCR Re-processing

For documents with poor OCR quality:

1. Review the document — if OCR is bad, add the `paperless-gpt-ocr-auto` tag
2. Paperless-GPT uses Claude's vision to re-OCR the document
3. After Claude OCR, manually re-add `paperless-gpt-auto` to re-tag with the improved text

## Why Claude Instead of a Local LLM?

This is the one service in the homelab that calls an external API, which might seem contradictory for a setup focused on local-first. I originally ran Paperless-GPT against Ollama with local models, but the tagging and OCR quality wasn't close — titles were inconsistent, tags were too generic or outright wrong, and vision-based OCR on poor scans was unreliable. Claude gets it right the vast majority of the time with minimal prompt tweaking.

The tradeoff is acceptable here because:

- **The documents are already digitized** — Paperless-ngx has already OCR'd them locally. Claude sees the extracted text (or a scan image for re-OCR), not raw financial accounts or login credentials.
- **It's a narrow, low-volume task** — a few documents per week, not a constant stream of personal data.
- **The quality gap is significant** — for document classification specifically, frontier models are meaningfully better than current local alternatives.

### Fully Local Alternatives

If sending documents to a cloud API isn't acceptable for your setup, Paperless-GPT supports Ollama as a backend. Models worth trying:

- **Llama 3.3 70B** — best local option for text-based tagging if you have the RAM (~40–45GB)
- **Mistral Small / Qwen 2.5 32B** — decent tagging quality at lower resource cost
- **LLaVA / Llama 3.2 Vision** — for vision-based OCR, though quality varies significantly by scan quality

Expect to spend more time on prompt engineering and accept lower consistency compared to a frontier model.

## Custom Prompts

Custom prompts are mounted at `./prompts:/app/prompts` in the Docker container.

## Known Issues

- LLM occasionally re-suggests system tags (`needs-review`, `paperless-gpt-ocr-complete`) — tracked at [icereed/paperless-gpt#877](https://github.com/icereed/paperless-gpt/issues/877)

## Related Pages

- [Paperless-ngx](../productivity/paperless.md) — the document management system
- [Paperless-AI](./paperless-ai.md) — RAG chat (separate from tagging)
- [Roci](../../hosts/roci.md) — host details
