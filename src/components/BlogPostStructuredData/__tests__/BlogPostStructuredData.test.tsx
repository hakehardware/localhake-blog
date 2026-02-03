import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogPostStructuredData, {
  generateBlogPostingJsonLd,
  type BlogPostStructuredDataProps,
} from '../index';

/**
 * Unit tests for BlogPostStructuredData component
 * Validates: Requirements 3.1-3.9
 */
describe('BlogPostStructuredData', () => {
  // Base props with all required fields for testing
  const baseProps: BlogPostStructuredDataProps = {
    title: 'Getting Started with Proxmox',
    description: 'A beginner guide to setting up Proxmox VE',
    datePublished: '2024-01-15',
    authorName: 'Hake',
    url: 'https://blog.localhake.com/blog/getting-started-proxmox',
  };

  describe('generateBlogPostingJsonLd', () => {
    /**
     * Validates: Requirement 3.1
     * WHEN a blog post is rendered, THEN THE SEO_System SHALL include JSON-LD BlogPosting schema
     */
    it('generates valid JSON-LD with @context and @type', () => {
      const jsonLd = generateBlogPostingJsonLd(baseProps);

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('BlogPosting');
    });

    /**
     * Validates: Requirement 3.2
     * THE BlogPosting schema SHALL include the `headline` property from the post title
     */
    it('includes headline from post title', () => {
      const jsonLd = generateBlogPostingJsonLd(baseProps);

      expect(jsonLd.headline).toBe('Getting Started with Proxmox');
    });

    /**
     * Validates: Requirement 3.3
     * THE BlogPosting schema SHALL include the `datePublished` property from the post date
     */
    it('includes datePublished from post date', () => {
      const jsonLd = generateBlogPostingJsonLd(baseProps);

      expect(jsonLd.datePublished).toBe('2024-01-15');
    });

    /**
     * Validates: Requirement 3.4
     * THE BlogPosting schema SHALL include the `dateModified` property (same as datePublished if not explicitly set)
     */
    it('uses datePublished as dateModified when not specified', () => {
      const jsonLd = generateBlogPostingJsonLd(baseProps);

      expect(jsonLd.dateModified).toBe('2024-01-15');
    });

    /**
     * Validates: Requirement 3.4
     * THE BlogPosting schema SHALL include the `dateModified` property when explicitly set
     */
    it('uses explicit dateModified when provided', () => {
      const propsWithDateModified: BlogPostStructuredDataProps = {
        ...baseProps,
        dateModified: '2024-02-20',
      };
      const jsonLd = generateBlogPostingJsonLd(propsWithDateModified);

      expect(jsonLd.dateModified).toBe('2024-02-20');
    });

    /**
     * Validates: Requirement 3.5
     * THE BlogPosting schema SHALL include the `author` property with author name from the post front matter
     */
    it('includes author with name from front matter', () => {
      const jsonLd = generateBlogPostingJsonLd(baseProps);

      expect(jsonLd.author).toEqual({
        '@type': 'Person',
        name: 'Hake',
      });
    });

    /**
     * Validates: Requirement 3.6
     * THE BlogPosting schema SHALL include the `publisher` property referencing the Organization schema
     */
    it('includes publisher with Organization reference', () => {
      const jsonLd = generateBlogPostingJsonLd(baseProps);

      expect(jsonLd.publisher).toEqual({
        '@type': 'Organization',
        name: 'Localhake',
        logo: {
          '@type': 'ImageObject',
          url: 'https://blog.localhake.com/img/favicon.png',
        },
      });
    });

    /**
     * Validates: Requirement 3.7
     * WHEN a post has an image specified, THEN THE BlogPosting schema SHALL include the `image` property
     */
    it('includes image when provided', () => {
      const propsWithImage: BlogPostStructuredDataProps = {
        ...baseProps,
        image: 'https://blog.localhake.com/img/proxmox-guide.png',
      };
      const jsonLd = generateBlogPostingJsonLd(propsWithImage);

      expect(jsonLd.image).toBe('https://blog.localhake.com/img/proxmox-guide.png');
    });

    /**
     * Validates: Requirement 3.7
     * WHEN a post does not have an image specified, THEN THE BlogPosting schema SHALL NOT include the `image` property
     */
    it('excludes image when not provided', () => {
      const jsonLd = generateBlogPostingJsonLd(baseProps);

      expect(jsonLd.image).toBeUndefined();
    });

    /**
     * Validates: Requirement 3.8
     * WHEN a post has a description, THEN THE BlogPosting schema SHALL include the `description` property
     */
    it('includes description when provided', () => {
      const jsonLd = generateBlogPostingJsonLd(baseProps);

      expect(jsonLd.description).toBe('A beginner guide to setting up Proxmox VE');
    });

    /**
     * Validates: Requirement 3.9
     * THE BlogPosting schema SHALL include the `mainEntityOfPage` property with the canonical URL
     */
    it('includes mainEntityOfPage with canonical URL', () => {
      const jsonLd = generateBlogPostingJsonLd(baseProps);

      expect(jsonLd.mainEntityOfPage).toEqual({
        '@type': 'WebPage',
        '@id': 'https://blog.localhake.com/blog/getting-started-proxmox',
      });
    });

    /**
     * Validates: Requirements 3.1-3.9
     * Test that all required fields are present in a single assertion
     */
    it('includes all required fields', () => {
      const jsonLd = generateBlogPostingJsonLd(baseProps);

      // Required schema.org fields
      expect(jsonLd['@context']).toBeDefined();
      expect(jsonLd['@type']).toBeDefined();

      // Required BlogPosting fields per requirements
      expect(jsonLd.headline).toBeDefined();
      expect(jsonLd.datePublished).toBeDefined();
      expect(jsonLd.dateModified).toBeDefined();
      expect(jsonLd.author).toBeDefined();
      expect(jsonLd.publisher).toBeDefined();
      expect(jsonLd.mainEntityOfPage).toBeDefined();
      expect(jsonLd.description).toBeDefined();
    });
  });

  describe('Component rendering', () => {
    /**
     * Validates: Requirement 3.1
     * WHEN a blog post is rendered, THEN THE SEO_System SHALL include JSON-LD BlogPosting schema
     */
    it('renders without errors', () => {
      expect(() => render(<BlogPostStructuredData {...baseProps} />)).not.toThrow();
    });

    /**
     * Validates: Requirement 3.1
     * The component should render a script tag with JSON-LD content
     */
    it('renders script tag with application/ld+json type', () => {
      const { container } = render(<BlogPostStructuredData {...baseProps} />);
      const scriptTag = container.querySelector('script[type="application/ld+json"]');

      expect(scriptTag).toBeInTheDocument();
    });

    /**
     * Validates: Requirements 3.1-3.9
     * The rendered JSON-LD should be valid JSON
     */
    it('renders valid JSON in script tag', () => {
      const { container } = render(<BlogPostStructuredData {...baseProps} />);
      const scriptTag = container.querySelector('script[type="application/ld+json"]');

      expect(scriptTag).toBeInTheDocument();
      expect(() => JSON.parse(scriptTag!.textContent || '')).not.toThrow();
    });

    /**
     * Validates: Requirements 3.1-3.9
     * The rendered JSON-LD should match the generated structure
     */
    it('renders JSON-LD matching generated structure', () => {
      const { container } = render(<BlogPostStructuredData {...baseProps} />);
      const scriptTag = container.querySelector('script[type="application/ld+json"]');
      const renderedJsonLd = JSON.parse(scriptTag!.textContent || '');
      const expectedJsonLd = generateBlogPostingJsonLd(baseProps);

      expect(renderedJsonLd).toEqual(expectedJsonLd);
    });
  });

  describe('Edge cases', () => {
    /**
     * Test handling of special characters in title
     */
    it('handles special characters in title', () => {
      const propsWithSpecialChars: BlogPostStructuredDataProps = {
        ...baseProps,
        title: 'Setting Up Docker & Kubernetes: A "Complete" Guide',
      };
      const jsonLd = generateBlogPostingJsonLd(propsWithSpecialChars);

      expect(jsonLd.headline).toBe('Setting Up Docker & Kubernetes: A "Complete" Guide');
    });

    /**
     * Test handling of empty description
     */
    it('handles empty description', () => {
      const propsWithEmptyDescription: BlogPostStructuredDataProps = {
        ...baseProps,
        description: '',
      };
      const jsonLd = generateBlogPostingJsonLd(propsWithEmptyDescription);

      expect(jsonLd.description).toBe('');
    });

    /**
     * Test handling of different date formats
     */
    it('handles ISO 8601 date format with time', () => {
      const propsWithFullDate: BlogPostStructuredDataProps = {
        ...baseProps,
        datePublished: '2024-01-15T10:30:00Z',
      };
      const jsonLd = generateBlogPostingJsonLd(propsWithFullDate);

      expect(jsonLd.datePublished).toBe('2024-01-15T10:30:00Z');
    });

    /**
     * Test handling of URLs with special characters
     */
    it('handles URLs with special characters', () => {
      const propsWithSpecialUrl: BlogPostStructuredDataProps = {
        ...baseProps,
        url: 'https://blog.localhake.com/blog/docker-compose-101',
      };
      const jsonLd = generateBlogPostingJsonLd(propsWithSpecialUrl);
      const mainEntityOfPage = jsonLd.mainEntityOfPage as { '@type': string; '@id': string };

      expect(mainEntityOfPage['@id']).toBe('https://blog.localhake.com/blog/docker-compose-101');
    });
  });
});
