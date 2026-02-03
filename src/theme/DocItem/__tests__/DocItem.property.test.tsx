import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { generateArticleJsonLd } from '../index';

/**
 * Property-based tests for DocItem wrapper component (Article JSON-LD)
 * 
 * Feature: seo-enhancements
 * Property 8: Article JSON-LD Completeness
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
 * 
 * *For any* wiki/docs page, the rendered HTML should contain a valid JSON-LD script
 * with `@type: Article` that includes:
 * - `headline` matching the page title
 * - `publisher` object with Organization reference
 * - `mainEntityOfPage` with canonical URL
 * - `description` if the page has a description in front matter
 */
describe('DocItem Property Tests', () => {
  /**
   * Custom arbitrary for generating valid HTTPS URLs for wiki/docs pages
   */
  const httpsUrlArbitrary = fc.tuple(
    fc.constantFrom('blog.localhake.com', 'example.com', 'test.org'),
    fc.constantFrom('wiki', 'docs', 'documentation'),
    fc.array(fc.stringMatching(/^[a-z0-9-]+$/), { minLength: 1, maxLength: 3 })
  ).map(([domain, prefix, pathParts]) => `https://${domain}/${prefix}/${pathParts.join('/')}`);

  /**
   * Custom arbitrary for generating valid site URLs
   */
  const siteUrlArbitrary = fc.constantFrom(
    'https://blog.localhake.com',
    'https://example.com',
    'https://test.org'
  );

  /**
   * Custom arbitrary for generating valid article props (without description)
   */
  const articlePropsArbitrary = fc.record({
    // Title must be non-empty string (docs pages always have titles)
    title: fc.string({ minLength: 1, maxLength: 200 }),
    // URL must be a valid HTTPS URL for the wiki/docs
    url: httpsUrlArbitrary,
    // Site URL for logo generation
    siteUrl: siteUrlArbitrary,
  });

  /**
   * Custom arbitrary for generating valid article props WITH description
   */
  const articlePropsWithDescriptionArbitrary = fc.record({
    title: fc.string({ minLength: 1, maxLength: 200 }),
    description: fc.string({ minLength: 1, maxLength: 500 }),
    url: httpsUrlArbitrary,
    siteUrl: siteUrlArbitrary,
  });

  /**
   * Custom arbitrary for generating valid article props with optional description
   */
  const articlePropsWithOptionalDescriptionArbitrary = fc.record({
    title: fc.string({ minLength: 1, maxLength: 200 }),
    description: fc.option(fc.string({ minLength: 1, maxLength: 500 }), { nil: undefined }),
    url: httpsUrlArbitrary,
    siteUrl: siteUrlArbitrary,
  });

  describe('Property 8: Article JSON-LD Completeness', () => {
    /**
     * Property: For any valid wiki/docs page, the JSON-LD should have correct schema.org context and type
     * 
     * **Validates: Requirement 7.1**
     * WHEN a wiki/docs page is rendered, THEN THE SEO_System SHALL include JSON-LD Article schema
     */
    it('should always include @context and @type for any valid wiki/docs page', () => {
      fc.assert(
        fc.property(
          articlePropsArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            
            expect(jsonLd['@context']).toBe('https://schema.org');
            expect(jsonLd['@type']).toBe('Article');
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid wiki/docs page, headline should match the page title
     * 
     * **Validates: Requirement 7.2**
     * THE Article schema SHALL include the `headline` property from the page title
     */
    it('should have headline matching page title for any valid wiki/docs page', () => {
      fc.assert(
        fc.property(
          articlePropsArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            
            expect(jsonLd.headline).toBe(props.title);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid wiki/docs page, publisher object should reference the Organization
     * 
     * **Validates: Requirement 7.3**
     * THE Article schema SHALL include the `publisher` property referencing the Organization schema
     */
    it('should have publisher object with Organization reference for any valid wiki/docs page', () => {
      fc.assert(
        fc.property(
          articlePropsArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            const publisher = jsonLd.publisher as { 
              '@type': string; 
              name: string; 
              logo: { '@type': string; url: string } 
            };
            
            expect(publisher).toBeDefined();
            expect(publisher['@type']).toBe('Organization');
            expect(publisher.name).toBe('Localhake');
            expect(publisher.logo).toBeDefined();
            expect(publisher.logo['@type']).toBe('ImageObject');
            expect(publisher.logo.url).toMatch(/^https?:\/\/.+/);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid wiki/docs page, publisher logo URL should use the site URL
     * 
     * **Validates: Requirement 7.3**
     * Tests that the logo URL is correctly constructed from the site URL
     */
    it('should have publisher logo URL constructed from site URL', () => {
      fc.assert(
        fc.property(
          articlePropsArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            const publisher = jsonLd.publisher as { 
              logo: { url: string } 
            };
            
            expect(publisher.logo.url).toBe(`${props.siteUrl}/img/favicon.png`);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid wiki/docs page, mainEntityOfPage should contain the canonical URL
     * 
     * **Validates: Requirement 7.4**
     * THE Article schema SHALL include the `mainEntityOfPage` property with the canonical URL
     */
    it('should have mainEntityOfPage with canonical URL for any valid wiki/docs page', () => {
      fc.assert(
        fc.property(
          articlePropsArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            const mainEntityOfPage = jsonLd.mainEntityOfPage as { '@type': string; '@id': string };
            
            expect(mainEntityOfPage).toBeDefined();
            expect(mainEntityOfPage['@type']).toBe('WebPage');
            expect(mainEntityOfPage['@id']).toBe(props.url);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: When description is specified, Article JSON-LD should include description property
     * 
     * **Validates: Requirement 7.5**
     * WHEN a docs page has a description, THEN THE Article schema SHALL include the `description` property
     */
    it('should include description property when description is specified', () => {
      fc.assert(
        fc.property(
          articlePropsWithDescriptionArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            
            expect(jsonLd.description).toBeDefined();
            expect(jsonLd.description).toBe(props.description);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: When description is NOT specified, Article JSON-LD should NOT include description property
     * 
     * **Validates: Requirement 7.5** (inverse case)
     * This ensures we don't include undefined/null description values in the JSON-LD
     */
    it('should NOT include description property when description is not specified', () => {
      fc.assert(
        fc.property(
          articlePropsArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            
            // Description should NOT be present in the JSON-LD when not provided
            expect(jsonLd).not.toHaveProperty('description');
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Description inclusion is conditional based on presence
     * 
     * **Validates: Requirement 7.5**
     * Tests the conditional behavior: description present → included, description absent → excluded
     */
    it('should conditionally include description based on whether it is provided', () => {
      fc.assert(
        fc.property(
          articlePropsWithOptionalDescriptionArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            
            if (props.description !== undefined) {
              // When description is provided, it should be in the JSON-LD
              expect(jsonLd.description).toBe(props.description);
            } else {
              // When description is not provided, it should not be in the JSON-LD
              expect(jsonLd).not.toHaveProperty('description');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid wiki/docs page, all required fields should be present
     * This is a comprehensive property that validates all required fields in a single assertion
     * 
     * **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
     */
    it('should include all required fields for any valid wiki/docs page', () => {
      fc.assert(
        fc.property(
          articlePropsArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            const publisher = jsonLd.publisher as { '@type': string; name: string };
            const mainEntityOfPage = jsonLd.mainEntityOfPage as { '@type': string; '@id': string };
            
            // Requirement 7.1: JSON-LD Article schema
            expect(jsonLd['@context']).toBe('https://schema.org');
            expect(jsonLd['@type']).toBe('Article');
            
            // Requirement 7.2: headline from page title
            expect(jsonLd.headline).toBe(props.title);
            
            // Requirement 7.3: publisher with Organization reference
            expect(publisher).toBeDefined();
            expect(publisher['@type']).toBe('Organization');
            expect(publisher.name).toBe('Localhake');
            
            // Requirement 7.4: mainEntityOfPage with canonical URL
            expect(mainEntityOfPage['@id']).toBe(props.url);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge Case Properties', () => {
    /**
     * Property: JSON-LD should be valid JSON for any input
     * The generated structure should always be serializable to valid JSON
     */
    it('should produce valid JSON for any valid wiki/docs page', () => {
      fc.assert(
        fc.property(
          articlePropsWithOptionalDescriptionArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            
            // Should not throw when stringifying
            expect(() => JSON.stringify(jsonLd)).not.toThrow();
            
            // Should be parseable back to equivalent object
            const serialized = JSON.stringify(jsonLd);
            const parsed = JSON.parse(serialized);
            expect(parsed).toEqual(jsonLd);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Special characters in title should be preserved
     * Titles with quotes, ampersands, and other special chars should not be escaped incorrectly
     */
    it('should preserve special characters in title', () => {
      // Generate strings that include special characters
      const specialCharTitleArbitrary = fc.record({
        title: fc.array(
          fc.oneof(
            fc.string({ minLength: 1, maxLength: 10 }),
            fc.constantFrom('"', "'", '&', '<', '>', '/', '\\')
          ),
          { minLength: 1, maxLength: 10 }
        ).map(arr => arr.join('')),
        url: fc.constant('https://blog.localhake.com/wiki/test'),
        siteUrl: fc.constant('https://blog.localhake.com'),
      });

      fc.assert(
        fc.property(
          specialCharTitleArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            
            // Title should be preserved exactly
            expect(jsonLd.headline).toBe(props.title);
            
            // Should still be valid JSON
            expect(() => JSON.stringify(jsonLd)).not.toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Various string content should be handled correctly
     * International characters, mixed content, etc. should be preserved
     */
    it('should handle various string content correctly', () => {
      // Use constantFrom with known unicode strings for testing
      const unicodeSamples = [
        '日本語タイトル',
        'Título en español',
        'Заголовок на русском',
        '🚀 Emoji Title 🎉',
        'Mixed: Hello 世界 مرحبا',
        'Ümlauts and äccénts',
      ];
      
      const mixedContentArbitrary = fc.record({
        title: fc.oneof(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.constantFrom(...unicodeSamples)
        ),
        description: fc.option(
          fc.oneof(
            fc.string({ minLength: 1, maxLength: 200 }),
            fc.constantFrom(
              'A guide to "self-hosting" your own services',
              "It's a beginner's tutorial",
              'Learn about <Docker> & Kubernetes'
            )
          ),
          { nil: undefined }
        ),
        url: fc.constant('https://blog.localhake.com/wiki/test'),
        siteUrl: fc.constant('https://blog.localhake.com'),
      });

      fc.assert(
        fc.property(
          mixedContentArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            
            // Content should be preserved
            expect(jsonLd.headline).toBe(props.title);
            
            if (props.description !== undefined) {
              expect(jsonLd.description).toBe(props.description);
            }
            
            // Should still be valid JSON
            expect(() => JSON.stringify(jsonLd)).not.toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Description with special characters should be preserved
     * 
     * **Validates: Requirement 7.5**
     * Ensures descriptions with quotes, HTML entities, etc. are preserved
     */
    it('should preserve description with special characters', () => {
      const specialDescriptionArbitrary = fc.constantFrom(
        'A guide to "self-hosting" your own services',
        "It's a beginner's tutorial",
        'Learn about <Docker> & Kubernetes',
        'Setting up Proxmox VE 8.0 - A Complete Guide',
        '🚀 Getting Started with Homelab 🏠',
        'Título en español: Configuración de servidores'
      );

      const articleWithSpecialDescArbitrary = fc.record({
        title: fc.string({ minLength: 1, maxLength: 200 }),
        description: specialDescriptionArbitrary,
        url: fc.constant('https://blog.localhake.com/wiki/test'),
        siteUrl: fc.constant('https://blog.localhake.com'),
      });

      fc.assert(
        fc.property(
          articleWithSpecialDescArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            
            // Description should be preserved exactly
            expect(jsonLd.description).toBe(props.description);
            
            // Should still produce valid JSON
            expect(() => JSON.stringify(jsonLd)).not.toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: URL should be preserved exactly as provided
     * 
     * **Validates: Requirement 7.4**
     * Ensures URLs with various formats are not modified
     */
    it('should preserve URL exactly as provided in mainEntityOfPage', () => {
      const urlVariantsArbitrary = fc.constantFrom(
        'https://blog.localhake.com/wiki/getting-started',
        'https://blog.localhake.com/wiki/hosts/proxmox',
        'https://blog.localhake.com/wiki/services/docker/setup',
        'https://example.com/docs/api-reference',
        'https://test.org/documentation/overview'
      );

      const articleWithVariousUrlsArbitrary = fc.record({
        title: fc.string({ minLength: 1, maxLength: 200 }),
        url: urlVariantsArbitrary,
        siteUrl: fc.constant('https://blog.localhake.com'),
      });

      fc.assert(
        fc.property(
          articleWithVariousUrlsArbitrary,
          (props) => {
            const jsonLd = generateArticleJsonLd(props);
            const mainEntityOfPage = jsonLd.mainEntityOfPage as { '@id': string };
            
            // URL should be exactly as provided
            expect(mainEntityOfPage['@id']).toBe(props.url);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
