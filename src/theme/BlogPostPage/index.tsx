import React from 'react';
import BlogPostPage from '@theme-original/BlogPostPage';
import type BlogPostPageType from '@theme/BlogPostPage';
import type { WrapperProps } from '@docusaurus/types';
import BlogPostStructuredData from '@site/src/components/BlogPostStructuredData';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Props = WrapperProps<typeof BlogPostPageType>;

/**
 * BlogPostPage wrapper component that injects BlogPosting JSON-LD structured data
 * 
 * This wrapper uses Docusaurus's swizzle pattern to wrap the original BlogPostPage
 * component and inject SEO structured data without modifying the original component.
 * 
 * The structured data is extracted from the blog post content props (which contain
 * the metadata) and passed to the BlogPostStructuredData component which renders
 * the JSON-LD script.
 * 
 * Note: We extract metadata from props.content.metadata instead of using useBlogPost()
 * because the wrapper is rendered BEFORE the BlogPostProvider is set up by the
 * original BlogPostPage component.
 * 
 * Validates: Requirements 3.1, 4.4, 4.5, 5.2, 5.5
 */
export default function BlogPostPageWrapper(props: Props): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  
  // Extract metadata from the content prop
  // The content prop is a PropBlogPostContent which has metadata attached
  const { content } = props;
  const { metadata, frontMatter } = content;
  
  const {
    title,
    description,
    date,
    authors,
    permalink,
  } = metadata;
  
  // Get author name from first author, fallback to 'Hake'
  const authorName = authors?.[0]?.name || 'Hake';
  
  // Build full image URL - use frontMatter image if provided, otherwise use site default
  const image = frontMatter?.image 
    ? `${siteConfig.url}${frontMatter.image}`
    : `${siteConfig.url}/img/localhake-social-card.png`;
  
  // Build canonical URL for the blog post
  const url = `${siteConfig.url}${permalink}`;
  
  return (
    <>
      <BlogPostStructuredData
        title={title}
        description={description || ''}
        datePublished={date}
        authorName={authorName}
        image={image}
        url={url}
      />
      <BlogPostPage {...props} />
    </>
  );
}
