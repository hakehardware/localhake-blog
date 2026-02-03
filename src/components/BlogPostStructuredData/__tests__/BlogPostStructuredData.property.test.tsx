import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { generateBlogPostingJsonLd } from '../index';

/**
 * Property-based tests for BlogPostStructuredData component
 * 
 * Feature: seo-enhancements
 * Property 3: BlogPosting JSON-LD Required Fields
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.9**
 * 
 * *For any* blog post page, the rendered HTML should contain a valid JSON-LD script
 * with `@type: BlogPosting` that includes:
 * - `headline` matching the post title
 * - `datePublished` matching the post date
 * - `dateModified` (equal to datePublished if not explicitly set)
 * - `author` object with name from front matter
 * - `publisher` object with Organization reference
 * - `mainEntityOfPage` with canonical URL
 */
describe('BlogPostStructuredData Property Tests', () => {
  /**
   * Custom arbitrary for generating valid ISO date strings (YYYY-MM-DD format)
   */
  const isoDateArbitrary = fc.tuple(
    fc.integer({ min: 2020, max: 2030 }), // year
    fc.integer({ min: 1, max: 12 }),       // month
    fc.integer({ min: 1, max: 28 })        // day (use 28 to avoid invalid dates)
  ).map(([year, month, day]) => 
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  );

  /**
   * Custom arbitrary for generating valid HTTPS URLs
   */
  const httpsUrlArbitrary = fc.tuple(
    fc.constantFrom('blog.localhake.com', 'example.com', 'test.org'),
    fc.array(fc.stringMatching(/^[a-z0-9-]+$/), { minLength: 1, maxLength: 3 })
  ).map(([domain, pathParts]) => `https://${domain}/${pathParts.join('/')}`);

  /**
   * Custom arbitrary for generating valid blog post props
   * Constrains inputs to realistic blog post metadata
   */
  const blogPostPropsArbitrary = fc.record({
    // Title must be non-empty string (blog posts always have titles)
    title: fc.string({ minLength: 1, maxLength: 200 }),
    // Description can be any string (may be empty in edge cases)
    description: fc.string({ maxLength: 500 }),
    // Date in ISO 8601 format (YYYY-MM-DD)
    datePublished: isoDateArbitrary,
    // Author name must be non-empty (all posts have authors)
    authorName: fc.string({ minLength: 1, maxLength: 100 }),
    // URL must be a valid HTTPS URL for the blog
    url: httpsUrlArbitrary,
  });

  /**
   * Extended arbitrary that includes optional dateModified
   */
  const blogPostPropsWithOptionalDateModifiedArbitrary = fc.record({
    title: fc.string({ minLength: 1, maxLength: 200 }),
    description: fc.string({ maxLength: 500 }),
    datePublished: isoDateArbitrary,
    dateModified: fc.option(isoDateArbitrary, { nil: undefined }),
    authorName: fc.string({ minLength: 1, maxLength: 100 }),
    url: httpsUrlArbitrary,
  });

  describe('Property 3: BlogPosting JSON-LD Required Fields', () => {
    /**
     * Property: For any valid blog post, the JSON-LD should have correct schema.org context and type
     * 
     * **Validates: Requirement 3.1**
     * WHEN a blog post is rendered, THEN THE SEO_System SHALL include JSON-LD BlogPosting schema
     */
    it('should always include @context and @type for any valid blog post', () => {
      fc.assert(
        fc.property(
          blogPostPropsArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
            expect(jsonLd['@context']).toBe('https://schema.org');
            expect(jsonLd['@type']).toBe('BlogPosting');
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid blog post, headline should match the post title
     * 
     * **Validates: Requirement 3.2**
     * THE BlogPosting schema SHALL include the `headline` property from the post title
     */
    it('should have headline matching post title for any valid blog post', () => {
      fc.assert(
        fc.property(
          blogPostPropsArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
            expect(jsonLd.headline).toBe(props.title);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid blog post, datePublished should match the post date
     * 
     * **Validates: Requirement 3.3**
     * THE BlogPosting schema SHALL include the `datePublished` property from the post date
     */
    it('should have datePublished matching post date for any valid blog post', () => {
      fc.assert(
        fc.property(
          blogPostPropsArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
            expect(jsonLd.datePublished).toBe(props.datePublished);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid blog post, dateModified should equal datePublished when not explicitly set
     * 
     * **Validates: Requirement 3.4**
     * THE BlogPosting schema SHALL include the `dateModified` property (same as datePublished if not explicitly set)
     */
    it('should have dateModified equal to datePublished when not explicitly set', () => {
      fc.assert(
        fc.property(
          blogPostPropsWithOptionalDateModifiedArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
            if (props.dateModified === undefined) {
              expect(jsonLd.dateModified).toBe(props.datePublished);
            } else {
              expect(jsonLd.dateModified).toBe(props.dateModified);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid blog post, author object should contain the author name
     * 
     * **Validates: Requirement 3.5**
     * THE BlogPosting schema SHALL include the `author` property with author name from the post front matter
     */
    it('should have author object with name from front matter for any valid blog post', () => {
      fc.assert(
        fc.property(
          blogPostPropsArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            const author = jsonLd.author as { '@type': string; name: string };
            
            expect(author).toBeDefined();
            expect(author['@type']).toBe('Person');
            expect(author.name).toBe(props.authorName);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid blog post, publisher object should reference the Organization
     * 
     * **Validates: Requirement 3.6**
     * THE BlogPosting schema SHALL include the `publisher` property referencing the Organization schema
     */
    it('should have publisher object with Organization reference for any valid blog post', () => {
      fc.assert(
        fc.property(
          blogPostPropsArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
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
     * Property: For any valid blog post, mainEntityOfPage should contain the canonical URL
     * 
     * **Validates: Requirement 3.9**
     * THE BlogPosting schema SHALL include the `mainEntityOfPage` property with the canonical URL
     */
    it('should have mainEntityOfPage with canonical URL for any valid blog post', () => {
      fc.assert(
        fc.property(
          blogPostPropsArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
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
     * Property: For any valid blog post, all required fields should be present
     * This is a comprehensive property that validates all required fields in a single assertion
     * 
     * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.9**
     */
    it('should include all required fields for any valid blog post', () => {
      fc.assert(
        fc.property(
          blogPostPropsArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            const author = jsonLd.author as { '@type': string; name: string };
            const publisher = jsonLd.publisher as { '@type': string; name: string };
            const mainEntityOfPage = jsonLd.mainEntityOfPage as { '@type': string; '@id': string };
            
            // Requirement 3.1: JSON-LD BlogPosting schema
            expect(jsonLd['@context']).toBe('https://schema.org');
            expect(jsonLd['@type']).toBe('BlogPosting');
            
            // Requirement 3.2: headline from post title
            expect(jsonLd.headline).toBe(props.title);
            
            // Requirement 3.3: datePublished from post date
            expect(jsonLd.datePublished).toBe(props.datePublished);
            
            // Requirement 3.4: dateModified (defaults to datePublished)
            expect(jsonLd.dateModified).toBeDefined();
            
            // Requirement 3.5: author with name
            expect(author.name).toBe(props.authorName);
            
            // Requirement 3.6: publisher with Organization reference
            expect(publisher).toBeDefined();
            expect(publisher['@type']).toBe('Organization');
            
            // Requirement 3.9: mainEntityOfPage with canonical URL
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
    it('should produce valid JSON for any valid blog post', () => {
      fc.assert(
        fc.property(
          blogPostPropsArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
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
        description: fc.string({ maxLength: 200 }),
        datePublished: fc.constant('2024-01-15'),
        authorName: fc.string({ minLength: 1, maxLength: 50 }),
        url: fc.constant('https://blog.localhake.com/blog/test'),
      });

      fc.assert(
        fc.property(
          specialCharTitleArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
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
        description: fc.string({ maxLength: 200 }),
        datePublished: fc.constant('2024-01-15'),
        authorName: fc.oneof(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.constantFrom('José García', '田中太郎', 'Müller')
        ),
        url: fc.constant('https://blog.localhake.com/blog/test'),
      });

      fc.assert(
        fc.property(
          mixedContentArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
            // Content should be preserved
            expect(jsonLd.headline).toBe(props.title);
            expect((jsonLd.author as { name: string }).name).toBe(props.authorName);
            
            // Should still be valid JSON
            expect(() => JSON.stringify(jsonLd)).not.toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 4: BlogPosting JSON-LD Conditional Fields
   * 
   * **Validates: Requirements 3.7, 3.8**
   * 
   * *For any* blog post with optional SEO fields in front matter:
   * - If `image` is specified, BlogPosting JSON-LD should include `image` property
   * - If `description` is specified, BlogPosting JSON-LD should include `description` property
   */
  describe('Property 4: BlogPosting JSON-LD Conditional Fields', () => {
    /**
     * Custom arbitrary for generating valid HTTPS image URLs
     */
    const imageUrlArbitrary = fc.tuple(
      fc.constantFrom('blog.localhake.com', 'example.com', 'cdn.example.com'),
      fc.array(fc.stringMatching(/^[a-z0-9-]+$/), { minLength: 1, maxLength: 3 }),
      fc.constantFrom('.png', '.jpg', '.jpeg', '.webp', '.gif')
    ).map(([domain, pathParts, ext]) => `https://${domain}/img/${pathParts.join('/')}${ext}`);

    /**
     * Custom arbitrary for generating valid ISO date strings (YYYY-MM-DD format)
     */
    const isoDateArb = fc.tuple(
      fc.integer({ min: 2020, max: 2030 }), // year
      fc.integer({ min: 1, max: 12 }),       // month
      fc.integer({ min: 1, max: 28 })        // day (use 28 to avoid invalid dates)
    ).map(([year, month, day]) => 
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    );

    /**
     * Custom arbitrary for generating valid HTTPS URLs
     */
    const httpsUrlArb = fc.tuple(
      fc.constantFrom('blog.localhake.com', 'example.com', 'test.org'),
      fc.array(fc.stringMatching(/^[a-z0-9-]+$/), { minLength: 1, maxLength: 3 })
    ).map(([domain, pathParts]) => `https://${domain}/${pathParts.join('/')}`);

    /**
     * Arbitrary for blog post props WITH image specified
     */
    const blogPostWithImageArbitrary = fc.record({
      title: fc.string({ minLength: 1, maxLength: 200 }),
      description: fc.string({ maxLength: 500 }),
      datePublished: isoDateArb,
      authorName: fc.string({ minLength: 1, maxLength: 100 }),
      url: httpsUrlArb,
      image: imageUrlArbitrary,
    });

    /**
     * Arbitrary for blog post props WITHOUT image (image is undefined)
     */
    const blogPostWithoutImageArbitrary = fc.record({
      title: fc.string({ minLength: 1, maxLength: 200 }),
      description: fc.string({ maxLength: 500 }),
      datePublished: isoDateArb,
      authorName: fc.string({ minLength: 1, maxLength: 100 }),
      url: httpsUrlArb,
    });

    /**
     * Arbitrary for blog post props WITH description specified (non-empty)
     */
    const blogPostWithDescriptionArbitrary = fc.record({
      title: fc.string({ minLength: 1, maxLength: 200 }),
      description: fc.string({ minLength: 1, maxLength: 500 }),
      datePublished: isoDateArb,
      authorName: fc.string({ minLength: 1, maxLength: 100 }),
      url: httpsUrlArb,
    });

    /**
     * Arbitrary for blog post props with optional image (may or may not be present)
     */
    const blogPostWithOptionalImageArbitrary = fc.record({
      title: fc.string({ minLength: 1, maxLength: 200 }),
      description: fc.string({ maxLength: 500 }),
      datePublished: isoDateArb,
      authorName: fc.string({ minLength: 1, maxLength: 100 }),
      url: httpsUrlArb,
      image: fc.option(imageUrlArbitrary, { nil: undefined }),
    });

    /**
     * Property: When image is specified, BlogPosting JSON-LD should include image property
     * 
     * **Validates: Requirement 3.7**
     * WHEN a post has an image specified, THEN THE BlogPosting schema SHALL include the `image` property
     */
    it('should include image property when image is specified', () => {
      fc.assert(
        fc.property(
          blogPostWithImageArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
            // Image should be present and match the input
            expect(jsonLd.image).toBeDefined();
            expect(jsonLd.image).toBe(props.image);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: When image is NOT specified, BlogPosting JSON-LD should NOT include image property
     * 
     * **Validates: Requirement 3.7** (inverse case)
     * This ensures we don't include undefined/null image values in the JSON-LD
     */
    it('should NOT include image property when image is not specified', () => {
      fc.assert(
        fc.property(
          blogPostWithoutImageArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
            // Image should NOT be present in the JSON-LD
            expect(jsonLd).not.toHaveProperty('image');
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Image inclusion is conditional based on presence
     * 
     * **Validates: Requirement 3.7**
     * Tests the conditional behavior: image present → included, image absent → excluded
     */
    it('should conditionally include image based on whether it is provided', () => {
      fc.assert(
        fc.property(
          blogPostWithOptionalImageArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
            if (props.image !== undefined) {
              // When image is provided, it should be in the JSON-LD
              expect(jsonLd.image).toBe(props.image);
            } else {
              // When image is not provided, it should not be in the JSON-LD
              expect(jsonLd).not.toHaveProperty('image');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: When description is specified, BlogPosting JSON-LD should include description property
     * 
     * **Validates: Requirement 3.8**
     * WHEN a post has a description, THEN THE BlogPosting schema SHALL include the `description` property
     */
    it('should include description property when description is specified', () => {
      fc.assert(
        fc.property(
          blogPostWithDescriptionArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
            // Description should be present and match the input
            expect(jsonLd.description).toBeDefined();
            expect(jsonLd.description).toBe(props.description);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Description is always included in JSON-LD (even if empty string)
     * 
     * **Validates: Requirement 3.8**
     * The component always includes description in the output
     */
    it('should always include description property in JSON-LD', () => {
      fc.assert(
        fc.property(
          blogPostWithoutImageArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
            // Description should always be present
            expect(jsonLd).toHaveProperty('description');
            expect(jsonLd.description).toBe(props.description);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Both image and description can be present together
     * 
     * **Validates: Requirements 3.7, 3.8**
     * Tests that both conditional fields work correctly when both are provided
     */
    it('should include both image and description when both are specified', () => {
      const blogPostWithBothArbitrary = fc.record({
        title: fc.string({ minLength: 1, maxLength: 200 }),
        description: fc.string({ minLength: 1, maxLength: 500 }),
        datePublished: isoDateArb,
        authorName: fc.string({ minLength: 1, maxLength: 100 }),
        url: httpsUrlArb,
        image: imageUrlArbitrary,
      });

      fc.assert(
        fc.property(
          blogPostWithBothArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
            // Both should be present
            expect(jsonLd.image).toBe(props.image);
            expect(jsonLd.description).toBe(props.description);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Image URLs should be preserved exactly as provided
     * 
     * **Validates: Requirement 3.7**
     * Ensures image URLs with various formats are not modified
     */
    it('should preserve image URL exactly as provided', () => {
      // Test with various image URL formats
      const imageUrlVariantsArbitrary = fc.constantFrom(
        'https://blog.localhake.com/img/post-image.png',
        'https://cdn.example.com/images/hero.jpg',
        'https://example.com/path/to/image.webp',
        'https://blog.localhake.com/img/social-card.jpeg',
        'https://example.com/img/test-123.gif'
      );

      const blogPostWithVariousImagesArbitrary = fc.record({
        title: fc.string({ minLength: 1, maxLength: 200 }),
        description: fc.string({ maxLength: 500 }),
        datePublished: isoDateArb,
        authorName: fc.string({ minLength: 1, maxLength: 100 }),
        url: httpsUrlArb,
        image: imageUrlVariantsArbitrary,
      });

      fc.assert(
        fc.property(
          blogPostWithVariousImagesArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
            // Image URL should be exactly as provided
            expect(jsonLd.image).toBe(props.image);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Description with special characters should be preserved
     * 
     * **Validates: Requirement 3.8**
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

      const blogPostWithSpecialDescArbitrary = fc.record({
        title: fc.string({ minLength: 1, maxLength: 200 }),
        description: specialDescriptionArbitrary,
        datePublished: isoDateArb,
        authorName: fc.string({ minLength: 1, maxLength: 100 }),
        url: httpsUrlArb,
      });

      fc.assert(
        fc.property(
          blogPostWithSpecialDescArbitrary,
          (props) => {
            const jsonLd = generateBlogPostingJsonLd(props);
            
            // Description should be preserved exactly
            expect(jsonLd.description).toBe(props.description);
            
            // Should still produce valid JSON
            expect(() => JSON.stringify(jsonLd)).not.toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
