import type { ReactNode } from 'react';

interface BlogPostPageProps {
  content?: unknown;
  sidebar?: unknown;
  blogMetadata?: unknown;
}

/**
 * Mock for @theme-original/BlogPostPage component
 * Renders a simple div for testing purposes
 */
export default function BlogPostPage(props: BlogPostPageProps): ReactNode {
  return <div data-testid="original-blog-post-page" data-props={JSON.stringify(props)} />;
}
