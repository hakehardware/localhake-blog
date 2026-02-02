---
title: FileBot
sidebar_label: FileBot
sidebar_position: 7
description: Automated media file organizer — sorts downloads into properly named media libraries
---

# FileBot

Automated media file organizer that takes raw downloads from [Syncthing](./syncthing.md) and sorts them into properly named, organized media libraries.

## Overview

| Property | Value |
|----------|-------|
| **VMID** | 119 |
| **IP** | 10.1.10.119 |
| **VLAN** | 10 |
| **Host** | tycho |
| **Type** | LXC |
| **OS** | Debian 13 |
| **License** | [your-filebot-license] |

## Resources

| Resource | Value |
|----------|-------|
| vCPU | 2 |
| RAM | 4GB |
| Swap | 512MB |
| Disk | 4GB |

## Storage Mounts

| Container Path | Host Path | Access |
|----------------|-----------|--------|
| `/downloads` | hdd-pool/downloads | Read-write |
| `/media/movies` | hdd-pool/media/movies | Read-write |
| `/media/tv` | hdd-pool/media/tv | Read-write |
| `/media/music` | hdd-pool/media/music | Read-write |
| `/media/audiobooks` | hdd-pool/media/audiobooks | Read-write |
| `/media/ebooks` | hdd-pool/media/ebooks | Read-write |

## How It Works

Two automated jobs handle all media organization:

### FileBot AMC Script (every 30 minutes)

The AMC (Automated Media Center) script scans `/downloads` and sorts recognized media into `/media/` with proper naming:

- **Movies** → `/media/movies/Movie Name (Year)/Movie Name (Year).mkv`
- **TV** → `/media/tv/Show Name/Season 01/Show Name - S01E01 - Episode Title.mkv`
- **Music** → `/media/music/Artist/Album/01 - Track.flac`

FileBot matches files against online databases (TheMovieDB, TheTVDB, MusicBrainz) for accurate renaming.

### rsync Script (hourly)

Audiobooks and ebooks don't need the same metadata matching, so a simpler rsync script copies them directly:

- **Audiobooks** → `/media/audiobooks/`
- **Ebooks** → `/media/ebooks/`

## How It Fits In

FileBot is step 4 in the [media pipeline](./media-pipeline.md):

1. qBittorrent downloads on seedbox
2. [Syncthing](./syncthing.md) syncs to NAS `/downloads/`
3. **FileBot sorts into `/media/`**
4. Streaming apps (Jellyfin, Navidrome, etc.) pick up new content

## Related Pages

- [Media Pipeline](./media-pipeline.md) — full end-to-end flow
- [Syncthing](./syncthing.md) — delivers downloads for FileBot to process
- [Jellyfin](./jellyfin.md), [Navidrome](./navidrome.md), [Audiobookshelf](./audiobookshelf.md), [Kavita](./kavita.md) — consume the organized media
- [Tycho](../../hosts/tycho.md) — host and storage details
