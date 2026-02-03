import type { ReactNode } from 'react';
import Head from '@docusaurus/Head';

/**
 * Props interface for BlogPostStructuredData component
 * Contains all metadata needed to generate BlogPosting JSON-LD
 */
export interface BlogPostStructuredDataProps {
  /** The blog post title - used as headline in JSON-LD */
  title: string;
  /** Meta description for the blog post */
  description: string;
  /** ISO 8601 date string when the post was published */
  datePublished: string;
  /** ISO 8601 date string when the post was last modified (optional, defaults to datePublished) */
  dateModified?: string;
  /** Name of the post author */
  authorName: string;
  /** Full URL to the post's featured image (optional) */
  image?: string;
  /** Canonical URL of the blog post */
  url: string;
}

/**
 * Generates the BlogPosting JSON-LD structured data object
 * This is exported for testing purposes
 * 
 * @param props - The blog post metadata
 * @returns The JSON-LD structured data object
 */
export function generateBlogPostingJsonLd(props: BlogPostStructuredDataProps): Record<string, unknown> {
  const {
    title,
    description,
    datePublished,
    dateModified,
    authorName,
    image,
    url,
  } = props;

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Localhake',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blog.localhake.com/img/favicon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  // Only include image if provided
  if (image) {
    structuredData.image = image;
  }

  return structuredData;
}

/**
 * BlogPostStructuredData component
 * 
 * Injects BlogPosting JSON-LD structured data into the page head
 * for SEO purposes. This enables rich snippets in Google search results
 * showing author, date, and image information.
 * 
 * @param props - Blog post metadata for JSON-LD generation
 * @returns JSX element that injects JSON-LD script into document head
 * 
 * @example
 * ```tsx
 * <BlogPostStructuredData
 *   title="Getting Started with Proxmox"
 *   description="A beginner's guide to setting up Proxmox VE"
 *   datePublished="2024-01-15"
 *   authorName="Hake"
 *   url="https://blog.localhake.com/blog/getting-started-proxmox"
 * />
 * ```
 * 
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9
 */
export default function BlogPostStructuredData(props: BlogPostStructuredDataProps): ReactNode {
  const structuredData = generateBlogPostingJsonLd(props);

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
}
