/**
 * Type declarations for Docusaurus blog plugin
 * 
 * These types extend the module type aliases to provide better type safety
 * for swizzled components that access blog post metadata.
 */

// Extend the @theme/BlogPostPage module to include proper typing for content
declare module '@theme/BlogPostPage' {
  import type { ReactNode, ComponentType } from 'react';

  export interface BlogPostAuthor {
    name?: string;
    title?: string;
    url?: string;
    imageURL?: string;
    key?: string;
  }

  export interface BlogPostFrontMatter {
    title?: string;
    description?: string;
    image?: string;
    keywords?: string[];
    slug?: string;
    tags?: string[];
    hide_table_of_contents?: boolean;
    toc_min_heading_level?: number;
    toc_max_heading_level?: number;
    [key: string]: unknown;
  }

  export interface BlogPostMetadata {
    title: string;
    description?: string;
    date: string;
    formattedDate: string;
    permalink: string;
    tags: Array<{ label: string; permalink: string }>;
    readingTime?: number;
    hasTruncateMarker: boolean;
    authors: BlogPostAuthor[];
    frontMatter: BlogPostFrontMatter;
    unlisted: boolean;
    nextItem?: { title: string; permalink: string };
    prevItem?: { title: string; permalink: string };
  }

  export interface BlogPostContent extends ComponentType {
    metadata: BlogPostMetadata;
    frontMatter: BlogPostFrontMatter;
    assets: {
      image?: string;
      authorsImageUrls: (string | undefined)[];
    };
    toc: Array<{ value: string; id: string; level: number }>;
  }

  export interface BlogSidebar {
    title: string;
    items: Array<{ title: string; permalink: string }>;
  }

  export interface BlogMetadata {
    blogTitle: string;
    blogDescription?: string;
    totalCount?: number;
    postsPerPage?: number;
    [key: string]: unknown;
  }

  export interface Props {
    readonly sidebar: BlogSidebar;
    readonly content: BlogPostContent;
    readonly blogMetadata: BlogMetadata;
  }

  export default function BlogPostPage(props: Props): ReactNode;
}
