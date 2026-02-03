import type { ReactNode } from 'react';

export interface BlogPostStructuredDataProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  image?: string;
  url: string;
}

/**
 * Mock for BlogPostStructuredData component
 * Renders a div with data attributes for testing purposes
 */
export default function BlogPostStructuredData(props: BlogPostStructuredDataProps): ReactNode {
  return (
    <div 
      data-testid="blog-post-structured-data"
      data-title={props.title}
      data-description={props.description}
      data-date-published={props.datePublished}
      data-date-modified={props.dateModified}
      data-author-name={props.authorName}
      data-image={props.image}
      data-url={props.url}
    />
  );
}
