import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DocItemWrapper from '../index';

/**
 * Unit tests for DocItem wrapper component
 * 
 * Tests that the wrapper:
 * 1. Injects Article JSON-LD structured data
 * 2. Includes headline matching page title
 * 3. Includes description when provided
 * 4. Does NOT include description when not provided
 * 5. Includes publisher Organization
 * 6. Includes mainEntityOfPage with correct URL
 * 7. Renders the original DocItem component
 * 
 * Validates: Requirements 7.1, 7.5
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

describe('DocItemWrapper', () => {
  /**
   * Helper function to create mock doc item props
   */
  const createMockProps = (overrides: {
    title?: string;
    description?: string | undefined;
    permalink?: string;
    includeDescription?: boolean;
  } = {}) => {
    const defaultMetadata = {
      title: 'Test Doc Page',
      permalink: '/wiki/test-page',
    };

    // Only include description if explicitly provided or if includeDescription is not false
    const shouldIncludeDescription = 'description' in overrides 
      ? overrides.description !== undefined 
      : overrides.includeDescription !== false;

    const metadata: Record<string, unknown> = {
      ...defaultMetadata,
      title: overrides.title ?? defaultMetadata.title,
      permalink: overrides.permalink ?? defaultMetadata.permalink,
    };

    // Add description only if it should be included
    if (shouldIncludeDescription) {
      metadata.description = overrides.description ?? 'A test documentation page description';
    }

    return {
      content: {
        metadata,
        frontMatter: {},
      },
    } as Parameters<typeof DocItemWrapper>[0];
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Article JSON-LD injection', () => {
    /**
     * Validates: Requirement 7.1
     * WHEN a wiki/docs page is rendered, THEN THE SEO_System SHALL include JSON-LD Article schema
     */
    it('renders Article JSON-LD script tag', () => {
      const props = createMockProps();
      render(<DocItemWrapper {...props} />);

      // Find the script tag with JSON-LD
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      expect(scripts.length).toBeGreaterThan(0);
      
      // Parse and verify it's an Article type
      const jsonLd = JSON.parse(scripts[0].textContent || '{}');
      expect(jsonLd['@type']).toBe('Article');
      expect(jsonLd['@context']).toBe('https://schema.org');
    });

    /**
     * Validates: Requirement 7.1
     * Test that headline matches page title
     */
    it('includes headline matching page title', () => {
      const props = createMockProps({ title: 'Getting Started with Docker' });
      render(<DocItemWrapper {...props} />);

      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(scripts[0].textContent || '{}');
      
      expect(jsonLd.headline).toBe('Getting Started with Docker');
    });

    /**
     * Validates: Requirement 7.5
     * WHEN a docs page has a description, THEN THE Article schema SHALL include the `description` property
     */
    it('includes description when provided', () => {
      const props = createMockProps({ 
        title: 'Docker Guide',
        description: 'A comprehensive guide to Docker containers' 
      });
      render(<DocItemWrapper {...props} />);

      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(scripts[0].textContent || '{}');
      
      expect(jsonLd.description).toBe('A comprehensive guide to Docker containers');
    });

    /**
     * Validates: Requirement 7.5
     * Test that description is NOT included when not provided
     */
    it('does NOT include description when not provided', () => {
      const props = createMockProps({ 
        title: 'Docker Guide',
        includeDescription: false,
      });
      render(<DocItemWrapper {...props} />);

      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(scripts[0].textContent || '{}');
      
      expect(jsonLd.description).toBeUndefined();
    });
  });

  describe('Publisher Organization', () => {
    /**
     * Validates: Requirement 7.3
     * THE Article schema SHALL include the `publisher` property referencing the Organization schema
     */
    it('includes publisher Organization', () => {
      const props = createMockProps();
      render(<DocItemWrapper {...props} />);

      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(scripts[0].textContent || '{}');
      
      expect(jsonLd.publisher).toBeDefined();
      expect(jsonLd.publisher['@type']).toBe('Organization');
      expect(jsonLd.publisher.name).toBe('Localhake');
    });

    /**
     * Test that publisher includes logo
     */
    it('includes publisher logo with correct URL', () => {
      const props = createMockProps();
      render(<DocItemWrapper {...props} />);

      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(scripts[0].textContent || '{}');
      
      expect(jsonLd.publisher.logo).toBeDefined();
      expect(jsonLd.publisher.logo['@type']).toBe('ImageObject');
      expect(jsonLd.publisher.logo.url).toBe('https://blog.localhake.com/img/favicon.png');
    });
  });

  describe('mainEntityOfPage', () => {
    /**
     * Validates: Requirement 7.4
     * THE Article schema SHALL include the `mainEntityOfPage` property with the canonical URL
     */
    it('includes mainEntityOfPage with correct URL', () => {
      const props = createMockProps({ permalink: '/wiki/proxmox-setup' });
      render(<DocItemWrapper {...props} />);

      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(scripts[0].textContent || '{}');
      
      expect(jsonLd.mainEntityOfPage).toBeDefined();
      expect(jsonLd.mainEntityOfPage['@type']).toBe('WebPage');
      expect(jsonLd.mainEntityOfPage['@id']).toBe('https://blog.localhake.com/wiki/proxmox-setup');
    });
  });

  describe('Original DocItem rendering', () => {
    /**
     * Test that the original DocItem component is rendered
     */
    it('renders the original DocItem component', () => {
      const props = createMockProps();
      render(<DocItemWrapper {...props} />);

      const originalDocItem = screen.getByTestId('original-doc-item');
      expect(originalDocItem).toBeInTheDocument();
    });

    /**
     * Test that both JSON-LD and original DocItem are rendered together
     */
    it('renders both Article JSON-LD and original DocItem', () => {
      const props = createMockProps();
      render(<DocItemWrapper {...props} />);

      // Check JSON-LD script exists
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      expect(scripts.length).toBeGreaterThan(0);
      
      // Check original DocItem exists
      expect(screen.getByTestId('original-doc-item')).toBeInTheDocument();
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
      render(<DocItemWrapper {...props} />);

      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(scripts[0].textContent || '{}');
      
      expect(jsonLd.headline).toBe('Docker & Kubernetes: A "Complete" Guide');
    });

    /**
     * Test that component doesn't crash with minimal props
     */
    it('renders without errors with minimal valid props', () => {
      const props = createMockProps();
      expect(() => render(<DocItemWrapper {...props} />)).not.toThrow();
    });
  });
});
