import React from 'react';
import DocItem from '@theme-original/DocItem';
import type DocItemType from '@theme/DocItem';
import type { WrapperProps } from '@docusaurus/types';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Props = WrapperProps<typeof DocItemType>;

/**
 * Props interface for Article JSON-LD generation
 * Contains all metadata needed to generate Article JSON-LD for wiki/docs pages
 */
export interface ArticleJsonLdProps {
  /** The page title - used as headline in JSON-LD */
  title: string;
  /** Meta description for the page (optional) */
  description?: string;
  /** Canonical URL of the page */
  url: string;
  /** Base URL of the site (used for logo URL) */
  siteUrl: string;
}

/**
 * Generates the Article JSON-LD structured data object
 * This is exported for testing purposes
 * 
 * @param props - The article metadata
 * @returns The JSON-LD structured data object
 * 
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5
 */
export function generateArticleJsonLd(props: ArticleJsonLdProps): Record<string, unknown> {
  const { title, description, url, siteUrl } = props;

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    publisher: {
      '@type': 'Organization',
      name: 'Localhake',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/img/favicon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  // Only include description if provided
  if (description) {
    structuredData.description = description;
  }

  return structuredData;
}

/**
 * DocItem wrapper component that injects Article JSON-LD structured data
 * 
 * This wrapper uses Docusaurus's swizzle pattern to wrap the original DocItem
 * component and inject SEO structured data for wiki/docs pages.
 * 
 * Note: We extract metadata from props.content.metadata instead of using useDoc()
 * because the wrapper is rendered BEFORE the DocProvider is set up by the
 * original DocItem component (similar to BlogPostPage).
 * 
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5
 */
export default function DocItemWrapper(props: Props): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  
  // Extract metadata from the content prop
  // The content prop has metadata attached (similar to BlogPostPage)
  const { content } = props;
  const { metadata } = content;
  
  const { title, description, permalink } = metadata;
  const url = `${siteConfig.url}${permalink}`;
  
  const structuredData = generateArticleJsonLd({
    title,
    description,
    url,
    siteUrl: siteConfig.url,
  });

  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <DocItem {...props} />
    </>
  );
}
