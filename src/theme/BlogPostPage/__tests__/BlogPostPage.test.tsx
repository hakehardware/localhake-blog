import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BlogPostPageWrapper from '../index';
import type { Props as BlogPostPageProps } from '@theme/BlogPostPage';

/**
 * Unit tests for BlogPostPage wrapper component
 * 
 * Tests that the wrapper:
 * 1. Injects BlogPostStructuredData component with correct props
 * 2. Falls back to site default image when not provided in frontMatter
 * 3. Falls back to 'Hake' when author name is not provided
 * 4. Renders the original BlogPostPage component
 * 
 * Validates: Requirements 3.1, 5.5
 */

// Mock useDocusaurusContext to control siteConfig values
vi.mock('@docusaurus/useDocusaurusContext', () => ({
  default: () => ({
    siteConfig: {
      title: 'Localhake',
      tagline: 'Homelab tutorials and documentation',
      url: 'https://blog.localhake.com',
    },
  }),
}));

describe('BlogPostPageWrapper', () => {
  /**
   * Helper function to create mock blog post props
   */
  const createMockProps = (overrides: {
    title?: string;
    description?: string;
    date?: string;
    authors?: Array<{ name?: string; title?: string; url?: string }>;
    permalink?: string;
    frontMatter?: { image?: string; [key: string]: unknown };
  } = {}): BlogPostPageProps => {
    const defaultMetadata = {
      title: 'Test Blog Post',
      description: 'A test blog post description',
      date: '2024-01-15',
      formattedDate: 'January 15, 2024',
      permalink: '/blog/test-post',
      tags: [],
      readingTime: 5,
      hasTruncateMarker: false,
      authors: [{ name: 'Hake', title: 'Author' }],
      frontMatter: {},
      unlisted: false,
    };

    const metadata = {
      ...defaultMetadata,
      title: overrides.title ?? defaultMetadata.title,
      description: overrides.description ?? defaultMetadata.description,
      date: overrides.date ?? defaultMetadata.date,
      authors: overrides.authors ?? defaultMetadata.authors,
      permalink: overrides.permalink ?? defaultMetadata.permalink,
      frontMatter: overrides.frontMatter ?? defaultMetadata.frontMatter,
    };

    return {
      sidebar: {
        title: 'Recent Posts',
        items: [],
      },
      content: {
        metadata,
        frontMatter: metadata.frontMatter,
        assets: {
          image: undefined,
          authorsImageUrls: [],
        },
        toc: [],
      } as unknown as BlogPostPageProps['content'],
      blogMetadata: {
        blogTitle: 'Blog',
      } as BlogPostPageProps['blogMetadata'],
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Structured data injection', () => {
    /**
     * Validates: Requirement 3.1
     * WHEN a blog post is rendered, THEN THE SEO_System SHALL include JSON-LD BlogPosting schema
     */
    it('renders BlogPostStructuredData component', () => {
      const props = createMockProps();
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toBeInTheDocument();
    });

    /**
     * Validates: Requirement 3.1
     * Test that structured data receives correct title from metadata
     */
    it('passes correct title to BlogPostStructuredData', () => {
      const props = createMockProps({ title: 'Getting Started with Proxmox' });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute('data-title', 'Getting Started with Proxmox');
    });

    /**
     * Validates: Requirement 3.1
     * Test that structured data receives correct description from metadata
     */
    it('passes correct description to BlogPostStructuredData', () => {
      const props = createMockProps({ description: 'A beginner guide to Proxmox VE' });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute('data-description', 'A beginner guide to Proxmox VE');
    });

    /**
     * Validates: Requirement 3.1
     * Test that structured data receives correct date from metadata
     */
    it('passes correct datePublished to BlogPostStructuredData', () => {
      const props = createMockProps({ date: '2024-03-20' });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute('data-date-published', '2024-03-20');
    });

    /**
     * Validates: Requirement 3.1
     * Test that structured data receives correct canonical URL
     */
    it('passes correct URL to BlogPostStructuredData', () => {
      const props = createMockProps({ permalink: '/blog/my-awesome-post' });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute('data-url', 'https://blog.localhake.com/blog/my-awesome-post');
    });

    /**
     * Test that empty description is handled correctly
     */
    it('handles empty description gracefully', () => {
      // Create props with explicitly undefined description
      const props: BlogPostPageProps = {
        sidebar: {
          title: 'Recent Posts',
          items: [],
        },
        content: {
          metadata: {
            title: 'Test Post',
            description: undefined,
            date: '2024-01-15',
            formattedDate: 'January 15, 2024',
            permalink: '/blog/test-post',
            tags: [],
            readingTime: 5,
            hasTruncateMarker: false,
            authors: [{ name: 'Hake' }],
            frontMatter: {},
            unlisted: false,
          },
          frontMatter: {},
          assets: {
            image: undefined,
            authorsImageUrls: [],
          },
          toc: [],
        } as unknown as BlogPostPageProps['content'],
        blogMetadata: {
          blogTitle: 'Blog',
        } as BlogPostPageProps['blogMetadata'],
      };
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      // Should pass empty string when description is undefined
      expect(structuredData).toHaveAttribute('data-description', '');
    });
  });

  describe('Image fallback behavior', () => {
    /**
     * Validates: Requirement 5.5
     * WHEN no post-specific image is provided, THEN THE SEO_System SHALL fall back to the site default image
     */
    it('uses site default image when frontMatter.image is not provided', () => {
      const props = createMockProps({ frontMatter: {} });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute(
        'data-image',
        'https://blog.localhake.com/img/localhake-social-card.png'
      );
    });

    /**
     * Validates: Requirement 5.2
     * WHEN a blog post specifies an `image` in front matter, THEN THE SEO_System SHALL use that image
     */
    it('uses frontMatter.image when provided', () => {
      const props = createMockProps({
        frontMatter: { image: '/img/custom-post-image.png' },
      });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute(
        'data-image',
        'https://blog.localhake.com/img/custom-post-image.png'
      );
    });

    /**
     * Validates: Requirement 5.5
     * Test that undefined frontMatter still falls back to default image
     */
    it('uses site default image when frontMatter is undefined', () => {
      const props = createMockProps({ frontMatter: undefined });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute(
        'data-image',
        'https://blog.localhake.com/img/localhake-social-card.png'
      );
    });

    /**
     * Test that image path is correctly prefixed with site URL
     */
    it('prefixes image path with site URL', () => {
      const props = createMockProps({
        frontMatter: { image: '/blog/2024-01-15/hero.png' },
      });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute(
        'data-image',
        'https://blog.localhake.com/blog/2024-01-15/hero.png'
      );
    });
  });

  describe('Author name fallback behavior', () => {
    /**
     * Test that author name is extracted from first author
     */
    it('uses first author name when authors array is provided', () => {
      const props = createMockProps({
        authors: [{ name: 'John Doe' }, { name: 'Jane Doe' }],
      });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute('data-author-name', 'John Doe');
    });

    /**
     * Test that author name falls back to 'Hake' when authors array is empty
     */
    it('falls back to "Hake" when authors array is empty', () => {
      const props = createMockProps({ authors: [] });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute('data-author-name', 'Hake');
    });

    /**
     * Test that author name falls back to 'Hake' when first author has no name
     */
    it('falls back to "Hake" when first author has no name', () => {
      const props = createMockProps({
        authors: [{ title: 'Author', url: 'https://example.com' }],
      });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute('data-author-name', 'Hake');
    });

    /**
     * Test that author name falls back to 'Hake' when authors is undefined
     */
    it('falls back to "Hake" when authors is undefined', () => {
      const props = createMockProps({ authors: undefined });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute('data-author-name', 'Hake');
    });
  });

  describe('Original BlogPostPage rendering', () => {
    /**
     * Test that the original BlogPostPage component is rendered
     */
    it('renders the original BlogPostPage component', () => {
      const props = createMockProps();
      render(<BlogPostPageWrapper {...props} />);

      const originalPage = screen.getByTestId('original-blog-post-page');
      expect(originalPage).toBeInTheDocument();
    });

    /**
     * Test that props are passed through to the original BlogPostPage
     */
    it('passes props to the original BlogPostPage', () => {
      const props = createMockProps({ title: 'Test Title' });
      render(<BlogPostPageWrapper {...props} />);

      const originalPage = screen.getByTestId('original-blog-post-page');
      expect(originalPage).toBeInTheDocument();
      
      // Verify the props were passed (the mock stores them as JSON)
      const propsAttr = originalPage.getAttribute('data-props');
      expect(propsAttr).toBeTruthy();
      const parsedProps = JSON.parse(propsAttr!);
      expect(parsedProps.content.metadata.title).toBe('Test Title');
    });

    /**
     * Test that both structured data and original page are rendered together
     */
    it('renders both BlogPostStructuredData and original BlogPostPage', () => {
      const props = createMockProps();
      render(<BlogPostPageWrapper {...props} />);

      expect(screen.getByTestId('blog-post-structured-data')).toBeInTheDocument();
      expect(screen.getByTestId('original-blog-post-page')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    /**
     * Test handling of special characters in title
     */
    it('handles special characters in title', () => {
      const props = createMockProps({
        title: 'Docker & Kubernetes: A "Complete" Guide',
      });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute(
        'data-title',
        'Docker & Kubernetes: A "Complete" Guide'
      );
    });

    /**
     * Test handling of ISO 8601 date format with time
     */
    it('handles ISO 8601 date format with time', () => {
      const props = createMockProps({ date: '2024-01-15T10:30:00Z' });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute('data-date-published', '2024-01-15T10:30:00Z');
    });

    /**
     * Test handling of permalink with special characters
     */
    it('handles permalink with hyphens and numbers', () => {
      const props = createMockProps({ permalink: '/blog/2024-01-15-docker-101' });
      render(<BlogPostPageWrapper {...props} />);

      const structuredData = screen.getByTestId('blog-post-structured-data');
      expect(structuredData).toHaveAttribute(
        'data-url',
        'https://blog.localhake.com/blog/2024-01-15-docker-101'
      );
    });

    /**
     * Test that component doesn't crash with minimal props
     */
    it('renders without errors with minimal valid props', () => {
      const props = createMockProps();
      expect(() => render(<BlogPostPageWrapper {...props} />)).not.toThrow();
    });
  });
});
