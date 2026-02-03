# Blog Post Creation Guide

A comprehensive guide for creating blog posts on the Localhake blog. This guide covers everything from quick start to advanced Docusaurus features.

## Table of Contents

- [Quick Start](#quick-start)
- [Directory Structure](#directory-structure)
- [Front Matter Reference](#front-matter-reference)
- [Custom Components](#custom-components)
- [Docusaurus Features](#docusaurus-features)
- [Images](#images)
- [SEO Best Practices](#seo-best-practices)
- [Templates](#templates)
- [Pre-Publish Checklist](#pre-publish-checklist)

---

## Quick Start

Create a new blog post in 5 simple steps:

### 1. Create the Post Directory

```bash
# Format: YYYY-MM-DD-slug
mkdir -p blog/2024-06-15-my-new-post
```

### 2. Create the MDX File

Create `blog/2024-06-15-my-new-post/index.mdx`:

```mdx
---
title: "My New Post Title"
slug: my-new-post
authors: [hake]
tags: [tutorial, docker, self-hosted]
date: 2024-06-15
difficulty: 3
time: 30
videoUrl: https://youtu.be/YOUR_VIDEO_ID
---

<InfoCard difficulty={3} time={30} videoUrl="https://youtu.be/YOUR_VIDEO_ID" />

Your introduction paragraph goes here. This appears in the blog listing.

{/* truncate */}

## First Section

Your content continues here...
```

### 3. Add Your Content

Write your tutorial content using Markdown and MDX components.

### 4. Preview Locally

```bash
pnpm start
```

Visit `http://localhost:3000/blog/my-new-post` to preview.

### 5. Commit and Deploy

```bash
git add .
git commit -m "Add blog post: My New Post Title"
git push
```

Vercel will automatically deploy your changes.

---

## Directory Structure

Blog posts use a **directory-based format** that keeps all post assets organized together.

### Format: `YYYY-MM-DD-slug/index.mdx`

Each blog post lives in its own directory following this naming convention:

```
blog/
├── 2024-01-15-paperless-ngx-setup/
│   ├── index.mdx           # Main post content
│   └── images/             # Post-specific images (optional)
│       ├── screenshot.png
│       └── diagram.svg
├── 2024-06-15-my-new-post/
│   └── index.mdx
└── authors.yml             # Global author definitions
```

### Naming Convention Breakdown

| Component | Description | Example |
|-----------|-------------|---------|
| `YYYY` | Four-digit year | `2024` |
| `MM` | Two-digit month (zero-padded) | `01`, `06`, `12` |
| `DD` | Two-digit day (zero-padded) | `01`, `15`, `31` |
| `slug` | URL-friendly identifier (lowercase, hyphens) | `paperless-ngx-setup` |

### Why This Format?

- **Chronological sorting**: Posts naturally sort by date in the file system
- **Asset co-location**: Images and other assets stay with their post
- **Clean URLs**: The `slug` front matter field controls the actual URL
- **Easy management**: Each post is self-contained and easy to move or delete

### Creating a New Post Directory

```bash
# Create directory for a new post
mkdir -p blog/2024-06-15-my-new-post

# Create the main content file
touch blog/2024-06-15-my-new-post/index.mdx

# Optional: Create images directory
mkdir -p blog/2024-06-15-my-new-post/images
```

:::tip
The directory date doesn't have to match the `date` field in front matter, but keeping them consistent is recommended for clarity.
:::

---

## Front Matter Reference

Front matter is YAML metadata at the top of your MDX file, enclosed by `---` markers. It defines how your post appears in listings and provides data for custom components.

### Required Fields

These fields must be present in every blog post:

```yaml
---
title: "How to Set Up Paperless-ngx with AI Document Processing"
slug: paperless-ngx-ai-setup
authors: [hake]
tags: [paperless, ai, docker, self-hosted]
date: 2024-01-15
---
```

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | The post title displayed in browser tabs, listings, and social shares. Use quotes for titles with special characters. |
| `slug` | string | URL-friendly identifier. This becomes the URL path: `/blog/paperless-ngx-ai-setup`. Use lowercase letters and hyphens only. |
| `authors` | array | List of author IDs from `authors.yml`. Use array syntax: `[hake]` or `[hake, guest]` for multiple authors. |
| `tags` | array | Categories for the post. Used for filtering and tag pages. Keep tags lowercase and consistent across posts. |
| `date` | date | Publication date in `YYYY-MM-DD` format. Determines post ordering and display date. |

### Optional Fields

These fields enable the InfoCard component and additional features:

```yaml
---
title: "How to Set Up Paperless-ngx with AI Document Processing"
slug: paperless-ngx-ai-setup
authors: [hake]
tags: [paperless, ai, docker, self-hosted]
date: 2024-01-15
difficulty: 3
time: 45
videoUrl: https://youtu.be/dQw4w9WgXcQ
---
```

| Field | Type | Description |
|-------|------|-------------|
| `difficulty` | number (1-5) | Tutorial difficulty level. 1 = Beginner, 5 = Expert. Used by InfoCard component. |
| `time` | number | Estimated completion time in minutes. Used by InfoCard component. |
| `videoUrl` | string | YouTube video URL for the companion video. Used by InfoCard component. Supports multiple URL formats. |

### SEO Fields

These fields improve search engine visibility and social media sharing:

```yaml
---
title: "How to Set Up Paperless-ngx with AI Document Processing"
slug: paperless-ngx-ai-setup
authors: [hake]
tags: [paperless, ai, docker, self-hosted]
date: 2024-01-15
difficulty: 3
time: 45
videoUrl: https://youtu.be/dQw4w9WgXcQ
description: "Learn how to set up Paperless-ngx with AI-powered document classification in Docker. Complete guide with step-by-step instructions."
keywords: [paperless-ngx, document management, AI, OCR, docker]
image: /img/blog/paperless-ngx-social-card.png
---
```

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Meta description for search engines and social sharing. **Recommended: 150-160 characters.** If not provided, Docusaurus generates one from the post excerpt. |
| `keywords` | array | Page-specific keywords for SEO. These are appended to the site-wide keywords. Use lowercase, relevant terms. |
| `image` | string | Social card image path (relative to `static/`). Used for `og:image` and `twitter:image`. **Recommended: 1200x630px.** Falls back to site default if not specified. |

:::tip SEO Best Practice
Always include a `description` field for important posts. A well-crafted meta description improves click-through rates from search results.
:::

### Author Definitions

Authors are defined in `blog/authors.yml`. Reference them by their ID in the `authors` field:

```yaml title="blog/authors.yml"
# Global author definitions for Hake's Homelab blog
# Reference authors in blog post front matter using: authors: [hake]

hake:
  name: Hake
  title: Creator @ Hake Hardware
  url: https://youtube.com/@HakeHardware
  # image_url: /img/authors/hake.png  # Optional - uncomment when author image is added
```

To add a new author, add an entry to `authors.yml`:

```yaml title="blog/authors.yml"
hake:
  name: Hake
  title: Creator @ Hake Hardware
  url: https://youtube.com/@HakeHardware

guest-author:
  name: Guest Author Name
  title: Guest Contributor
  url: https://example.com
  image_url: /img/authors/guest.png
```

Then reference in your post:

```yaml
authors: [hake, guest-author]
```

### Complete Front Matter Example

Here's a complete example with all fields:

```yaml
---
title: "How to Set Up Paperless-ngx with AI Document Processing"
slug: paperless-ngx-ai-setup
authors: [hake]
tags: [paperless, ai, docker, self-hosted, document-management]
date: 2024-01-15
difficulty: 3
time: 45
videoUrl: https://youtu.be/dQw4w9WgXcQ
description: "Learn how to set up Paperless-ngx with AI-powered document classification in Docker. Complete guide with step-by-step instructions."
keywords: [paperless-ngx, document management, AI, OCR, docker]
image: /img/blog/paperless-ngx-social-card.png
---
```

:::warning
The `slug` field controls the URL, not the directory name. Make sure your slug is unique across all posts to avoid URL conflicts.
:::

---

## Custom Components

The blog uses custom React components that are globally available in all MDX files. These components are registered in `src/theme/MDXComponents.tsx` and can be used without imports.

### InfoCard

The `InfoCard` component displays tutorial metadata at the top of blog posts, showing difficulty level, estimated time, and a link to the companion YouTube video.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `difficulty` | `1 \| 2 \| 3 \| 4 \| 5` | No | Tutorial difficulty level displayed as visual indicators (filled circles) |
| `time` | `number` | No | Estimated completion time in minutes. Automatically formatted (e.g., 90 → "1h 30m") |
| `videoUrl` | `string` | No | YouTube video URL. Renders as a "Watch on YouTube" link |

#### Difficulty Levels

| Level | Meaning | Typical Use |
|-------|---------|-------------|
| 1 | Beginner | Basic concepts, no prior knowledge needed |
| 2 | Easy | Some familiarity with the topic helpful |
| 3 | Intermediate | Requires foundational knowledge |
| 4 | Advanced | Complex topics, multiple technologies |
| 5 | Expert | Deep technical knowledge required |

#### Usage Examples

**Full InfoCard with all props:**

```mdx
<InfoCard difficulty={3} time={45} videoUrl="https://youtu.be/dQw4w9WgXcQ" />
```

**Partial InfoCard (only some props):**

```mdx
{/* Only difficulty and time */}
<InfoCard difficulty={2} time={30} />

{/* Only video link */}
<InfoCard videoUrl="https://youtu.be/VIDEO_ID" />

{/* Only difficulty */}
<InfoCard difficulty={4} />
```

**Real example from existing blog post:**

```mdx title="blog/2024-01-15-paperless-ngx-setup/index.mdx"
---
title: "How to Set Up Paperless-ngx with AI Document Processing"
slug: paperless-ngx-ai-setup
authors: [hake]
tags: [paperless, ai, docker, self-hosted, document-management]
date: 2024-01-15
difficulty: 3
time: 45
videoUrl: https://youtu.be/dQw4w9WgXcQ
---

<InfoCard difficulty={3} time={45} videoUrl="https://youtu.be/dQw4w9WgXcQ" />

In this tutorial, we'll set up **Paperless-ngx**...
```

:::tip Best Practice
Place the `InfoCard` immediately after the front matter, before your introduction paragraph. Match the prop values with your front matter fields for consistency.
:::

#### Behavior Notes

- **Graceful handling**: If no props are provided or all provided values are invalid, the component renders nothing
- **Time formatting**: Minutes are automatically converted to human-readable format:
  - `45` → "45m"
  - `90` → "1h 30m"
  - `120` → "2h"
- **Accessibility**: Difficulty indicators include proper ARIA labels for screen readers

---

### YouTube

The `YouTube` component embeds a responsive, privacy-enhanced YouTube video player. It uses `youtube-nocookie.com` for enhanced privacy.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `url` | `string` | Yes | YouTube video URL (multiple formats supported) |
| `title` | `string` | No | Accessibility title for the iframe. Defaults to "YouTube video" |

#### Supported URL Formats

The component accepts multiple YouTube URL formats:

| Format | Example |
|--------|---------|
| Short URL | `https://youtu.be/VIDEO_ID` |
| Watch URL | `https://www.youtube.com/watch?v=VIDEO_ID` |
| Watch URL (no www) | `https://youtube.com/watch?v=VIDEO_ID` |
| Embed URL | `https://www.youtube.com/embed/VIDEO_ID` |
| Mobile URL | `https://m.youtube.com/watch?v=VIDEO_ID` |
| HTTP variants | All above formats with `http://` |

#### Usage Examples

**Basic usage:**

```mdx
<YouTube url="https://youtu.be/dQw4w9WgXcQ" />
```

**With custom title (recommended for accessibility):**

```mdx
<YouTube url="https://youtu.be/dQw4w9WgXcQ" title="Paperless-ngx Setup Tutorial" />
```

**Different URL formats (all work the same):**

```mdx
{/* Short URL - recommended */}
<YouTube url="https://youtu.be/dQw4w9WgXcQ" />

{/* Full watch URL */}
<YouTube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />

{/* Embed URL */}
<YouTube url="https://www.youtube.com/embed/dQw4w9WgXcQ" />
```

**Real example from existing blog post:**

```mdx title="blog/2024-01-15-paperless-ngx-setup/index.mdx"
## What is Paperless-ngx?

Paperless-ngx is a community-supported open-source document management system...

<YouTube url="https://youtu.be/dQw4w9WgXcQ" title="Paperless-ngx Setup Tutorial" />

## Prerequisites

Before we begin, make sure you have...
```

:::tip Best Practice
Always provide a descriptive `title` prop for accessibility. The title should describe the video content, not just "YouTube video".
:::

#### Behavior Notes

- **Privacy-enhanced**: Uses `youtube-nocookie.com` domain to prevent tracking cookies until the user plays the video
- **Responsive**: The embed automatically scales to fit its container while maintaining 16:9 aspect ratio
- **Lazy loading**: Videos load lazily to improve page performance
- **Error handling**: Invalid URLs display a user-friendly error message instead of a broken embed

#### Error Display

If an invalid URL is provided, the component displays an error message:

```mdx
{/* This will show an error */}
<YouTube url="not-a-valid-url" />
{/* Displays: ⚠️ Invalid URL format */}

<YouTube url="https://example.com/video" />
{/* Displays: ⚠️ URL is not a YouTube link */}
```

---

### Component Placement Guidelines

For consistent blog post structure, follow this recommended order:

```mdx
---
title: "Your Post Title"
slug: your-post-slug
authors: [hake]
tags: [tag1, tag2]
date: 2024-06-15
difficulty: 3
time: 30
videoUrl: https://youtu.be/VIDEO_ID
---

{/* 1. InfoCard at the very top */}
<InfoCard difficulty={3} time={30} videoUrl="https://youtu.be/VIDEO_ID" />

{/* 2. Introduction paragraph */}
Your introduction paragraph that appears in blog listings...

{/* 3. Truncate marker */}
{/* truncate */}

{/* 4. First section - often includes the YouTube embed */}
## Overview

Brief overview of what we'll cover...

<YouTube url="https://youtu.be/VIDEO_ID" title="Tutorial Video" />

{/* 5. Rest of your content */}
## Step 1: Getting Started
...
```

---

## Docusaurus Features

Docusaurus provides several built-in features that enhance your blog posts. These features are available in all MDX files without any imports.

### Admonitions

Admonitions are callout boxes that highlight important information. Use them to draw attention to tips, warnings, or critical information.

#### Available Types

| Type | Use Case |
|------|----------|
| `note` | General information or clarification |
| `tip` | Helpful suggestions or best practices |
| `info` | Additional context or background information |
| `warning` | Potential issues or things to be careful about |
| `danger` | Critical warnings about destructive actions or security risks |

#### Syntax

```mdx
:::note
This is a general note with additional information.
:::

:::tip
This is a helpful tip or best practice.
:::

:::info
This provides additional context or background information.
:::

:::warning
Be careful! This warns about potential issues.
:::

:::danger
Critical warning! This action could cause data loss or security issues.
:::
```

#### With Custom Titles

You can customize the admonition title:

```mdx
:::tip Pro Tip
Use environment variables for sensitive configuration values.
:::

:::warning Compatibility Notice
This feature requires Docker version 24.0 or later.
:::

:::danger Data Loss Warning
Running this command will permanently delete all data. Make sure you have a backup!
:::
```

#### Practical Examples

**Tip for configuration:**

```mdx
:::tip Best Practice
Always use Docker Compose for multi-container applications. It makes managing dependencies and networking much easier.
:::
```

**Warning about prerequisites:**

```mdx
:::warning Prerequisites
Make sure you have at least 4GB of RAM available before starting this container. Running with less memory may cause performance issues or crashes.
:::
```

**Danger for destructive operations:**

```mdx
:::danger Destructive Action
The following command will delete all volumes and their data:
```bash
docker volume prune -f
```
This cannot be undone. Ensure you have backups before proceeding.
:::
```

---

### Code Blocks

Code blocks support syntax highlighting, line highlighting, line numbers, and titles.

#### Basic Syntax Highlighting

Specify the language after the opening backticks:

````mdx
```bash
docker compose up -d
```

```yaml
version: '3.8'
services:
  app:
    image: nginx:latest
```

```typescript
const greeting: string = "Hello, World!";
console.log(greeting);
```
````

#### Supported Languages

Common languages used in homelab tutorials:

| Language | Identifier |
|----------|------------|
| Bash/Shell | `bash`, `shell`, `sh` |
| YAML | `yaml`, `yml` |
| JSON | `json` |
| TypeScript | `typescript`, `ts` |
| JavaScript | `javascript`, `js` |
| Docker | `dockerfile` |
| Nginx | `nginx` |
| Python | `python`, `py` |
| SQL | `sql` |
| TOML | `toml` |
| INI | `ini` |

#### Code Block Titles

Add a title to show the filename or context:

````mdx
```yaml title="docker-compose.yml"
version: '3.8'
services:
  paperless:
    image: ghcr.io/paperless-ngx/paperless-ngx:latest
    ports:
      - "8000:8000"
```

```bash title="Terminal"
docker compose up -d
```

```typescript title="src/config.ts"
export const config = {
  apiUrl: process.env.API_URL,
  debug: process.env.NODE_ENV === 'development',
};
```
````

#### Line Highlighting

Highlight specific lines to draw attention:

````mdx
```yaml title="docker-compose.yml" {4-6}
version: '3.8'
services:
  paperless:
    # highlight-start
    environment:
      - PAPERLESS_SECRET_KEY=your-secret-key
      - PAPERLESS_OCR_LANGUAGE=eng
    # highlight-end
    ports:
      - "8000:8000"
```
````

You can also use line numbers directly:

````mdx
```yaml {3,5-7}
version: '3.8'
services:
  paperless:  # Line 3 highlighted
    image: ghcr.io/paperless-ngx/paperless-ngx:latest
    environment:  # Lines 5-7 highlighted
      - PAPERLESS_SECRET_KEY=your-secret-key
      - PAPERLESS_OCR_LANGUAGE=eng
```
````

#### Line Numbers

Show line numbers for longer code blocks:

````mdx
```typescript showLineNumbers
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```
````

#### Combining Features

You can combine title, line highlighting, and line numbers:

````mdx
```yaml title="docker-compose.yml" showLineNumbers {5-8}
version: '3.8'
services:
  paperless:
    image: ghcr.io/paperless-ngx/paperless-ngx:latest
    environment:
      - PAPERLESS_SECRET_KEY=change-me
      - PAPERLESS_OCR_LANGUAGE=eng
      - PAPERLESS_TIME_ZONE=America/New_York
    volumes:
      - ./data:/usr/src/paperless/data
    ports:
      - "8000:8000"
```
````

---

### Truncate Marker

The truncate marker controls what appears in blog post listings (the blog index page). Content before the marker appears as the post excerpt; content after is only visible on the full post page.

#### Syntax

For MDX files, use the JSX comment syntax:

```mdx
---
title: "My Post Title"
slug: my-post
authors: [hake]
tags: [tutorial]
date: 2024-06-15
---

<InfoCard difficulty={3} time={30} />

This introduction paragraph appears in the blog listing. It should summarize what the post covers and entice readers to click through.

{/* truncate */}

## Getting Started

This content only appears on the full post page...
```

For plain Markdown files (`.md`), use the HTML comment syntax:

```md
This is the excerpt that appears in listings.

<!-- truncate -->

This content only appears on the full post page.
```

#### Best Practices

1. **Keep excerpts concise**: 2-3 sentences that summarize the post
2. **Place after InfoCard**: The InfoCard should be above the truncate marker so it appears in listings
3. **Include a hook**: Make readers want to click through to read more
4. **Avoid headers in excerpt**: Don't include `##` headers before the truncate marker

#### Example

```mdx
---
title: "How to Set Up Paperless-ngx with AI Document Processing"
slug: paperless-ngx-ai-setup
authors: [hake]
tags: [paperless, ai, docker]
date: 2024-01-15
difficulty: 3
time: 45
videoUrl: https://youtu.be/VIDEO_ID
---

<InfoCard difficulty={3} time={45} videoUrl="https://youtu.be/VIDEO_ID" />

In this tutorial, we'll set up **Paperless-ngx**, a powerful document management system, and configure it with AI-powered document classification. By the end, you'll have a fully automated system for organizing your digital documents.

{/* truncate */}

## What is Paperless-ngx?

Paperless-ngx is a community-supported open-source document management system...
```

---

## Images

Images can be added to blog posts in two ways: co-located with the post or stored in the static directory.

### Co-located Images (Recommended)

Store images in the same directory as your blog post. This keeps assets organized with their content.

#### Directory Structure

```
blog/
└── 2024-06-15-my-post/
    ├── index.mdx
    └── images/
        ├── screenshot.png
        ├── diagram.svg
        └── architecture.png
```

Or place images directly in the post directory:

```
blog/
└── 2024-06-15-my-post/
    ├── index.mdx
    ├── screenshot.png
    └── banner.jpeg
```

#### Usage in MDX

Reference co-located images with relative paths:

```mdx
{/* Image in images/ subdirectory */}
![Screenshot of the dashboard](./images/screenshot.png)

{/* Image directly in post directory */}
![Banner image](./banner.jpeg)

{/* With alt text for accessibility */}
![Paperless-ngx dashboard showing document list and search interface](./images/dashboard.png)
```

#### Real Example

From the existing blog structure:

```mdx title="blog/2021-08-26-welcome/index.md"
A blog post folder can be convenient to co-locate blog post images:

![Docusaurus Plushie](./docusaurus-plushie-banner.jpeg)
```

### Static Directory Images

For images shared across multiple posts or site-wide assets, use the `static/img/` directory.

#### Directory Structure

```
static/
└── img/
    ├── blog/
    │   └── shared-diagram.png
    └── common/
        └── logo.png
```

#### Usage in MDX

Reference static images with absolute paths (starting with `/`):

```mdx
![Shared diagram](/img/blog/shared-diagram.png)

![Site logo](/img/common/logo.png)
```

### Image Best Practices

1. **Use descriptive alt text**: Describe what the image shows for accessibility
2. **Optimize file sizes**: Compress images before adding (use tools like ImageOptim, TinyPNG)
3. **Use appropriate formats**:
   - **PNG**: Screenshots, diagrams with text
   - **JPEG**: Photos, complex images
   - **SVG**: Logos, icons, simple diagrams
   - **WebP**: Modern format with good compression (check browser support)
4. **Consistent naming**: Use lowercase, hyphenated names (`dashboard-overview.png`)
5. **Reasonable dimensions**: Resize large images to max ~1200px width

### Adding Captions

For images that need captions, use a paragraph below:

```mdx
![Paperless-ngx dashboard](./images/dashboard.png)

*The Paperless-ngx dashboard showing the document list with AI-generated tags.*
```

Or use HTML for more control:

```mdx
<figure>
  <img src={require('./images/dashboard.png').default} alt="Paperless-ngx dashboard" />
  <figcaption>The Paperless-ngx dashboard showing the document list with AI-generated tags.</figcaption>
</figure>
```

---

## SEO Best Practices

Optimizing your blog posts for search engines helps readers discover your content. Follow these guidelines for better search visibility.

### Meta Descriptions

The `description` field in front matter becomes the meta description shown in search results.

**Guidelines:**
- **Length**: 150-160 characters (Google truncates longer descriptions)
- **Include keywords**: Naturally incorporate your main topic keywords
- **Be compelling**: Write a description that encourages clicks
- **Be accurate**: Describe what the post actually covers

**Good example:**
```yaml
description: "Learn how to set up Paperless-ngx with AI-powered document classification in Docker. Complete guide with step-by-step instructions."
```

**Bad examples:**
```yaml
# Too short - doesn't provide enough context
description: "Paperless-ngx setup guide."

# Too long - will be truncated in search results
description: "In this comprehensive tutorial, we will walk through every single step of setting up Paperless-ngx, a powerful open-source document management system, with AI-powered document classification using Docker containers on your homelab server."

# Keyword stuffing - reads unnaturally
description: "Paperless-ngx Paperless setup Paperless Docker Paperless AI document management Paperless tutorial."
```

### Keywords

The `keywords` field adds page-specific keywords that supplement the site-wide defaults.

**Guidelines:**
- Use 3-7 relevant keywords per post
- Use lowercase, hyphenated terms
- Include variations (e.g., "docker", "docker-compose", "containers")
- Focus on terms people actually search for

**Example:**
```yaml
keywords: [paperless-ngx, document-management, ai-ocr, docker-compose, self-hosted]
```

### Social Card Images

The `image` field specifies a custom image for social media sharing (Open Graph and Twitter Cards).

**Guidelines:**
- **Dimensions**: 1200x630 pixels (optimal for all platforms)
- **Format**: PNG or JPEG
- **Location**: Store in `static/img/blog/` for shared images, or co-locate with the post
- **Content**: Include the post title or key visual that represents the content
- **Fallback**: If not specified, the site default social card is used

**Example with co-located image:**
```yaml
image: /img/blog/paperless-ngx-social-card.png
```

**Creating social card images:**
1. Use a consistent template with your branding
2. Include the post title in readable text
3. Use high contrast for visibility in small thumbnails
4. Test how it looks when shared on Twitter and LinkedIn

### Structured Data

The site automatically generates structured data (JSON-LD) for blog posts, including:
- **BlogPosting schema**: Helps Google understand your content for rich snippets
- **Author information**: Links to your author profile
- **Publication dates**: Shows when content was published/updated

To maximize structured data benefits:
- Always include a `description` field
- Use accurate `date` values
- Ensure author IDs match entries in `authors.yml`

### SEO Checklist

Add these checks to your pre-publish routine:

- [ ] **Description**: Is it 150-160 characters and compelling?
- [ ] **Keywords**: Are 3-7 relevant keywords included?
- [ ] **Image**: Is a custom social card image provided for important posts?
- [ ] **Title**: Is it descriptive and includes main keywords?
- [ ] **Tags**: Are tags relevant and consistent with existing posts?

---

## Templates

Copy-paste templates for creating new blog posts.

### Basic Blog Post Template

For simple posts without video companion:

```mdx
---
title: "Your Post Title Here"
slug: your-post-slug
authors: [hake]
tags: [tag1, tag2, tag3]
date: 2024-06-15
description: "A brief, compelling description of your post (150-160 characters recommended)."
keywords: [keyword1, keyword2, keyword3]
---

Your introduction paragraph goes here. This appears in the blog listing and should summarize what the post covers.

{/* truncate */}

## Introduction

Expand on your introduction here...

## Prerequisites

Before we begin, make sure you have:

- Requirement 1
- Requirement 2
- Requirement 3

## Step 1: First Step Title

Instructions for the first step...

```bash
# Example command
docker compose up -d
```

## Step 2: Second Step Title

Instructions for the second step...

## Conclusion

Summarize what was accomplished and suggest next steps.

## Resources

- [Link to documentation](https://example.com)
- [Related tutorial](https://example.com)
```

### Video Tutorial Template

For posts accompanying a YouTube video:

```mdx
---
title: "Your Tutorial Title Here"
slug: your-tutorial-slug
authors: [hake]
tags: [tutorial, docker, self-hosted]
date: 2024-06-15
difficulty: 3
time: 30
videoUrl: https://youtu.be/YOUR_VIDEO_ID
description: "A brief, compelling description of your tutorial (150-160 characters recommended)."
keywords: [tutorial-topic, docker, self-hosted]
image: /img/blog/your-tutorial-social-card.png
---

<InfoCard difficulty={3} time={30} videoUrl="https://youtu.be/YOUR_VIDEO_ID" />

Brief introduction explaining what this tutorial covers and what readers will learn. Keep it to 2-3 sentences.

{/* truncate */}

## Video

Watch the full tutorial on YouTube:

<YouTube url="https://youtu.be/YOUR_VIDEO_ID" title="Your Tutorial Title" />

## Overview

Provide a brief overview of what we'll be setting up and why it's useful.

## Prerequisites

Before starting, ensure you have:

- Docker and Docker Compose installed
- Basic familiarity with the command line
- At least 2GB of available RAM

:::tip
If you haven't installed Docker yet, check out our [Docker installation guide](/wiki/services/docker).
:::

## Step 1: Create the Project Directory

```bash title="Terminal"
mkdir -p ~/docker/your-app
cd ~/docker/your-app
```

## Step 2: Create the Docker Compose File

```yaml title="docker-compose.yml"
version: '3.8'
services:
  app:
    image: your-image:latest
    container_name: your-app
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

## Step 3: Start the Container

```bash title="Terminal"
docker compose up -d
```

Verify it's running:

```bash
docker compose ps
```

## Step 4: Initial Configuration

Navigate to `http://your-server-ip:8080` to access the web interface.

![Initial setup screen](./images/setup-screen.png)

:::warning
Make sure to change the default password immediately after first login!
:::

## Troubleshooting

### Common Issue 1

If you encounter this error:

```
Error message here
```

Solution: Explanation of how to fix it.

### Common Issue 2

Description of another common issue and its solution.

## Conclusion

You now have a fully configured instance of [App Name] running in Docker. 

**Next steps:**
- Configure additional settings
- Set up backups
- Explore advanced features

## Resources

- [Official Documentation](https://example.com/docs)
- [GitHub Repository](https://github.com/example/repo)
- [Community Forum](https://example.com/forum)
```

### Quick Post Template

For shorter announcements or updates:

```mdx
---
title: "Quick Update Title"
slug: quick-update-slug
authors: [hake]
tags: [update, announcement]
date: 2024-06-15
description: "Brief description of the update or announcement (150-160 characters)."
---

Brief announcement or update content. This template is for shorter posts that don't need the full tutorial structure.

{/* truncate */}

## Details

More details about the update...

## What's Next

Brief mention of upcoming content or changes.
```

---

## Pre-Publish Checklist

Before publishing your blog post, verify the following:

### Front Matter

- [ ] **Title**: Is it descriptive and compelling?
- [ ] **Slug**: Is it URL-friendly (lowercase, hyphens, no special characters)?
- [ ] **Authors**: Does the author ID exist in `authors.yml`?
- [ ] **Tags**: Are tags lowercase and consistent with existing tags?
- [ ] **Date**: Is the date correct and in `YYYY-MM-DD` format?
- [ ] **Optional fields**: If using InfoCard, are `difficulty`, `time`, and `videoUrl` set?

### SEO Fields

- [ ] **Description**: Is it 150-160 characters and compelling?
- [ ] **Keywords**: Are 3-7 relevant keywords included?
- [ ] **Image**: Is a custom social card image provided for important posts?

### Content Quality

- [ ] **Introduction**: Does the excerpt (before truncate) clearly summarize the post?
- [ ] **Truncate marker**: Is `{/* truncate */}` placed after the introduction?
- [ ] **InfoCard placement**: Is the InfoCard immediately after front matter (if used)?
- [ ] **Headings**: Are headings hierarchical (H2 → H3 → H4)?
- [ ] **Code blocks**: Do all code blocks have language identifiers?
- [ ] **Links**: Do all links work? Are external links using `https://`?

### Images

- [ ] **Alt text**: Do all images have descriptive alt text?
- [ ] **File size**: Are images optimized (compressed)?
- [ ] **Paths**: Are image paths correct (relative for co-located, absolute for static)?
- [ ] **Display**: Do images display correctly in preview?

### Components

- [ ] **InfoCard**: Do prop values match front matter values?
- [ ] **YouTube**: Is the URL valid and video accessible?
- [ ] **Admonitions**: Are admonition types appropriate for the content?

### Technical

- [ ] **Build**: Does `pnpm build` complete without errors?
- [ ] **Preview**: Does the post look correct at `http://localhost:3000/blog/your-slug`?
- [ ] **Mobile**: Does the post look good on mobile viewport?
- [ ] **Spelling**: Have you checked for typos and grammatical errors?

### Final Steps

```bash
# 1. Build to check for errors
pnpm build

# 2. Preview locally
pnpm start
# Visit http://localhost:3000/blog/your-slug

# 3. Commit and push
git add .
git commit -m "Add blog post: Your Post Title"
git push
```

:::tip
Run `pnpm build` before pushing to catch any errors that might cause the deployment to fail.
:::
