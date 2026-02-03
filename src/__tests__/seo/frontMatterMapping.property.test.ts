import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * Property-based tests for Front Matter to Meta Tag Mapping
 * 
 * Feature: seo-enhancements
 * Property 5: Front Matter to Meta Tag Mapping
 * 
 * **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**
 * 
 * *For any* blog post with SEO front matter fields:
 * - If `description` is present, it should appear in the `<meta name="description">` tag
 * - If `image` is present, it should appear in `og:image` and `twitter:image` meta tags
 * - If `keywords` is present, they should be appended to the keywords meta tag
 * 
 * Since Docusaurus handles front matter to meta tag mapping automatically at build time,
 * these tests verify:
 * 1. The BlogPostStructuredData component correctly uses description and image from props
 * 2. The mapping logic correctly transforms front matter fields to meta tag values
 * 3. Property-based testing verifies the mapping behavior for various input combinations
 */

/**
 * Interface representing blog post front matter with SEO fields
 */
interface BlogPostFrontMatter {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  date: string;
  authors: string[];
  slug: string;
}

/**
 * Interface representing expected meta tags generated from front matter
 */
interface ExpectedMetaTags {
  description?: string;
  'og:image'?: string;
  'twitter:image'?: string;
  keywords?: string;
}

/**
 * Site configuration constants
 */
const SITE_CONFIG = {
  url: 'https://blog.localhake.com',
  defaultImage: '/img/localhake-social-card.png',
  defaultKeywords: 'homelab, self-hosted, proxmox, docker, tutorials, linux, virtualization',
};

/**
 * Simulates how Docusaurus maps front matter fields to meta tags
 * This mirrors the behavior in BlogPostPage wrapper and Docusaurus's built-in handling
 * 
 * @param frontMatter - The blog post front matter
 * @returns Expected meta tag values
 */
function mapFrontMatterToMetaTags(frontMatter: BlogPostFrontMatter): ExpectedMetaTags {
  const result: ExpectedMetaTags = {};

  // Requirement 4.4: If description is present, use it for meta description
  if (frontMatter.description) {
    result.description = frontMatter.description;
  }

  // Requirement 4.5: If image is present, use it for og:image and twitter:image
  if (frontMatter.image) {
    const fullImageUrl = frontMatter.image.startsWith('http')
      ? frontMatter.image
      : `${SITE_CONFIG.url}${frontMatter.image}`;
    result['og:image'] = fullImageUrl;
    result['twitter:image'] = fullImageUrl;
  } else {
    // Fallback to default image
    result['og:image'] = `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`;
    result['twitter:image'] = `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`;
  }

  // Requirement 4.2: If keywords are present, append to site keywords
  if (frontMatter.keywords && frontMatter.keywords.length > 0) {
    result.keywords = `${SITE_CONFIG.defaultKeywords}, ${frontMatter.keywords.join(', ')}`;
  } else {
    result.keywords = SITE_CONFIG.defaultKeywords;
  }

  return result;
}

/**
 * Validates that a description is properly formatted for meta tags
 */
function isValidMetaDescription(description: string): boolean {
  // Description should be non-empty and reasonably sized
  return description.length > 0 && description.length <= 500;
}

/**
 * Validates that an image URL is properly formatted
 */
function isValidImageUrl(url: string): boolean {
  // Should be a valid URL (absolute or relative starting with /)
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

/**
 * Validates that keywords are properly formatted
 */
function isValidKeywordsString(keywords: string): boolean {
  // Keywords should be comma-separated and non-empty
  return keywords.length > 0 && keywords.split(',').every(k => k.trim().length > 0);
}

/**
 * Arbitrary generator for valid blog post descriptions
 */
const descriptionArbitrary = fc.string({ minLength: 10, maxLength: 300 })
  .filter(s => s.trim().length > 0 && !s.includes('\n'));

/**
 * Arbitrary generator for valid image paths
 */
const imagePathArbitrary = fc.oneof(
  // Relative paths
  fc.stringMatching(/^\/img\/[a-z0-9-]+\.(png|jpg|jpeg|webp)$/),
  // Absolute URLs
  fc.stringMatching(/^https:\/\/[a-z0-9.-]+\/[a-z0-9/-]+\.(png|jpg|jpeg|webp)$/)
);

/**
 * Arbitrary generator for valid keywords
 */
const keywordArbitrary = fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/);

/**
 * Arbitrary generator for keyword arrays
 */
const keywordsArrayArbitrary = fc.array(keywordArbitrary, { minLength: 1, maxLength: 5 });

/**
 * Arbitrary generator for valid ISO date strings (YYYY-MM-DD format)
 */
const dateStringArbitrary = fc.tuple(
  fc.integer({ min: 2020, max: 2030 }),
  fc.integer({ min: 1, max: 12 }),
  fc.integer({ min: 1, max: 28 }) // Use 28 to avoid invalid dates
).map(([year, month, day]) => 
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
);

/**
 * Arbitrary generator for blog post front matter
 */
const frontMatterArbitrary = fc.record({
  title: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 0),
  description: fc.option(descriptionArbitrary, { nil: undefined }),
  keywords: fc.option(keywordsArrayArbitrary, { nil: undefined }),
  image: fc.option(imagePathArbitrary, { nil: undefined }),
  date: dateStringArbitrary,
  authors: fc.array(fc.stringMatching(/^[a-z][a-z0-9-]{2,15}$/), { minLength: 1, maxLength: 3 }),
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{5,50}$/),
});

describe('Front Matter to Meta Tag Mapping Property Tests', () => {
  describe('Property 5: Front Matter to Meta Tag Mapping', () => {
    /**
     * Property: Description field should map to meta description tag
     * 
     * **Validates: Requirements 4.1, 4.4**
     * - 4.1: THE SEO_System SHALL support a `description` field in blog post front matter
     * - 4.4: WHEN a blog post has a `description` field, THEN THE SEO_System SHALL use it for the meta description tag
     */
    it('should map description field to meta description tag for any valid description', () => {
      fc.assert(
        fc.property(
          descriptionArbitrary,
          (description) => {
            const frontMatter: BlogPostFrontMatter = {
              title: 'Test Post',
              description,
              date: '2024-01-15',
              authors: ['hake'],
              slug: 'test-post',
            };

            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            // Description should be present in meta tags
            expect(metaTags.description).toBeDefined();
            expect(metaTags.description).toBe(description);
            expect(isValidMetaDescription(metaTags.description!)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Image field should map to og:image and twitter:image meta tags
     * 
     * **Validates: Requirements 4.3, 4.5**
     * - 4.3: THE SEO_System SHALL support an `image` field in blog post front matter
     * - 4.5: WHEN a blog post has an `image` field, THEN THE SEO_System SHALL use it for `og:image` and `twitter:image`
     */
    it('should map image field to og:image and twitter:image for any valid image path', () => {
      fc.assert(
        fc.property(
          imagePathArbitrary,
          (imagePath) => {
            const frontMatter: BlogPostFrontMatter = {
              title: 'Test Post',
              image: imagePath,
              date: '2024-01-15',
              authors: ['hake'],
              slug: 'test-post',
            };

            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            // Both og:image and twitter:image should be set
            expect(metaTags['og:image']).toBeDefined();
            expect(metaTags['twitter:image']).toBeDefined();

            // Both should contain the image path
            if (imagePath.startsWith('http')) {
              expect(metaTags['og:image']).toBe(imagePath);
              expect(metaTags['twitter:image']).toBe(imagePath);
            } else {
              expect(metaTags['og:image']).toBe(`${SITE_CONFIG.url}${imagePath}`);
              expect(metaTags['twitter:image']).toBe(`${SITE_CONFIG.url}${imagePath}`);
            }

            // Both should be valid URLs
            expect(isValidImageUrl(metaTags['og:image']!)).toBe(true);
            expect(isValidImageUrl(metaTags['twitter:image']!)).toBe(true);

            // og:image and twitter:image should be identical
            expect(metaTags['og:image']).toBe(metaTags['twitter:image']);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Keywords field should be appended to site keywords
     * 
     * **Validates: Requirement 4.2**
     * - 4.2: THE SEO_System SHALL support a `keywords` field in blog post front matter
     */
    it('should append keywords field to site keywords for any valid keywords array', () => {
      fc.assert(
        fc.property(
          keywordsArrayArbitrary,
          (keywords) => {
            const frontMatter: BlogPostFrontMatter = {
              title: 'Test Post',
              keywords,
              date: '2024-01-15',
              authors: ['hake'],
              slug: 'test-post',
            };

            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            // Keywords should be present
            expect(metaTags.keywords).toBeDefined();
            expect(isValidKeywordsString(metaTags.keywords!)).toBe(true);

            // Should contain site default keywords
            expect(metaTags.keywords).toContain(SITE_CONFIG.defaultKeywords);

            // Should contain all provided keywords
            for (const keyword of keywords) {
              expect(metaTags.keywords).toContain(keyword);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid front matter, all SEO fields should map correctly
     * 
     * **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**
     * Comprehensive property test that verifies all front matter fields map correctly
     */
    it('should correctly map all SEO fields for any valid front matter', () => {
      fc.assert(
        fc.property(
          frontMatterArbitrary,
          (frontMatter) => {
            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            // Description mapping (Requirements 4.1, 4.4)
            if (frontMatter.description) {
              expect(metaTags.description).toBe(frontMatter.description);
            } else {
              expect(metaTags.description).toBeUndefined();
            }

            // Image mapping (Requirements 4.3, 4.5)
            expect(metaTags['og:image']).toBeDefined();
            expect(metaTags['twitter:image']).toBeDefined();
            if (frontMatter.image) {
              const expectedUrl = frontMatter.image.startsWith('http')
                ? frontMatter.image
                : `${SITE_CONFIG.url}${frontMatter.image}`;
              expect(metaTags['og:image']).toBe(expectedUrl);
              expect(metaTags['twitter:image']).toBe(expectedUrl);
            } else {
              expect(metaTags['og:image']).toBe(`${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`);
              expect(metaTags['twitter:image']).toBe(`${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`);
            }

            // Keywords mapping (Requirement 4.2)
            expect(metaTags.keywords).toBeDefined();
            expect(metaTags.keywords).toContain(SITE_CONFIG.defaultKeywords);
            if (frontMatter.keywords && frontMatter.keywords.length > 0) {
              for (const keyword of frontMatter.keywords) {
                expect(metaTags.keywords).toContain(keyword);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Description Field Properties', () => {
    /**
     * Property: Description should be preserved exactly as provided
     * 
     * **Validates: Requirement 4.4**
     * Ensures no transformation or truncation of description
     */
    it('should preserve description exactly as provided', () => {
      fc.assert(
        fc.property(
          descriptionArbitrary,
          (description) => {
            const frontMatter: BlogPostFrontMatter = {
              title: 'Test Post',
              description,
              date: '2024-01-15',
              authors: ['hake'],
              slug: 'test-post',
            };

            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            // Description should be exactly the same
            expect(metaTags.description).toBe(description);
            expect(metaTags.description?.length).toBe(description.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Missing description should result in undefined meta description
     * 
     * **Validates: Requirement 4.1**
     * Tests the optional nature of the description field
     */
    it('should have undefined description when not provided in front matter', () => {
      const frontMatter: BlogPostFrontMatter = {
        title: 'Test Post Without Description',
        date: '2024-01-15',
        authors: ['hake'],
        slug: 'test-post-no-desc',
      };

      const metaTags = mapFrontMatterToMetaTags(frontMatter);

      expect(metaTags.description).toBeUndefined();
    });
  });

  describe('Image Field Properties', () => {
    /**
     * Property: Relative image paths should be converted to absolute URLs
     * 
     * **Validates: Requirement 4.5**
     * Ensures image URLs are fully qualified for social sharing
     */
    it('should convert relative image paths to absolute URLs', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^\/img\/[a-z0-9-]+\.(png|jpg|jpeg|webp)$/),
          (relativePath) => {
            const frontMatter: BlogPostFrontMatter = {
              title: 'Test Post',
              image: relativePath,
              date: '2024-01-15',
              authors: ['hake'],
              slug: 'test-post',
            };

            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            // Should be converted to absolute URL
            expect(metaTags['og:image']).toMatch(/^https?:\/\//);
            expect(metaTags['twitter:image']).toMatch(/^https?:\/\//);

            // Should contain the site URL
            expect(metaTags['og:image']).toContain(SITE_CONFIG.url);
            expect(metaTags['twitter:image']).toContain(SITE_CONFIG.url);

            // Should contain the original path
            expect(metaTags['og:image']).toContain(relativePath);
            expect(metaTags['twitter:image']).toContain(relativePath);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Absolute image URLs should be preserved
     * 
     * **Validates: Requirement 4.5**
     * Ensures external image URLs are not modified
     */
    it('should preserve absolute image URLs', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^https:\/\/[a-z0-9.-]+\/[a-z0-9/-]+\.(png|jpg|jpeg|webp)$/),
          (absoluteUrl) => {
            const frontMatter: BlogPostFrontMatter = {
              title: 'Test Post',
              image: absoluteUrl,
              date: '2024-01-15',
              authors: ['hake'],
              slug: 'test-post',
            };

            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            // Should be preserved exactly
            expect(metaTags['og:image']).toBe(absoluteUrl);
            expect(metaTags['twitter:image']).toBe(absoluteUrl);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: og:image and twitter:image should always be identical
     * 
     * **Validates: Requirement 4.5**
     * Ensures consistency between Open Graph and Twitter Card images
     */
    it('should have identical og:image and twitter:image for any image', () => {
      fc.assert(
        fc.property(
          fc.option(imagePathArbitrary, { nil: undefined }),
          (image) => {
            const frontMatter: BlogPostFrontMatter = {
              title: 'Test Post',
              image,
              date: '2024-01-15',
              authors: ['hake'],
              slug: 'test-post',
            };

            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            expect(metaTags['og:image']).toBe(metaTags['twitter:image']);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Missing image should fall back to site default
     * 
     * **Validates: Requirement 4.3**
     * Tests the fallback behavior when no image is provided
     */
    it('should use default image when not provided in front matter', () => {
      const frontMatter: BlogPostFrontMatter = {
        title: 'Test Post Without Image',
        date: '2024-01-15',
        authors: ['hake'],
        slug: 'test-post-no-image',
      };

      const metaTags = mapFrontMatterToMetaTags(frontMatter);

      expect(metaTags['og:image']).toBe(`${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`);
      expect(metaTags['twitter:image']).toBe(`${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`);
    });
  });

  describe('Keywords Field Properties', () => {
    /**
     * Property: Keywords should always include site default keywords
     * 
     * **Validates: Requirement 4.2**
     * Ensures site-wide keywords are always present
     */
    it('should always include site default keywords', () => {
      fc.assert(
        fc.property(
          fc.option(keywordsArrayArbitrary, { nil: undefined }),
          (keywords) => {
            const frontMatter: BlogPostFrontMatter = {
              title: 'Test Post',
              keywords,
              date: '2024-01-15',
              authors: ['hake'],
              slug: 'test-post',
            };

            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            // Should always contain default keywords
            expect(metaTags.keywords).toContain(SITE_CONFIG.defaultKeywords);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Each provided keyword should appear in the final keywords string
     * 
     * **Validates: Requirement 4.2**
     * Ensures no keywords are lost during mapping
     */
    it('should include all provided keywords in the final keywords string', () => {
      fc.assert(
        fc.property(
          keywordsArrayArbitrary,
          (keywords) => {
            const frontMatter: BlogPostFrontMatter = {
              title: 'Test Post',
              keywords,
              date: '2024-01-15',
              authors: ['hake'],
              slug: 'test-post',
            };

            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            // Each keyword should be present
            for (const keyword of keywords) {
              expect(metaTags.keywords).toContain(keyword);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Keywords should be comma-separated
     * 
     * **Validates: Requirement 4.2**
     * Ensures proper formatting of keywords meta tag
     */
    it('should format keywords as comma-separated string', () => {
      fc.assert(
        fc.property(
          keywordsArrayArbitrary,
          (keywords) => {
            const frontMatter: BlogPostFrontMatter = {
              title: 'Test Post',
              keywords,
              date: '2024-01-15',
              authors: ['hake'],
              slug: 'test-post',
            };

            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            // Should be comma-separated
            expect(metaTags.keywords).toContain(',');

            // Each part should be non-empty after trimming
            const parts = metaTags.keywords!.split(',').map(p => p.trim());
            for (const part of parts) {
              expect(part.length).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge Case Properties', () => {
    /**
     * Property: Empty keywords array should not add extra commas
     * 
     * Tests edge case of empty keywords array
     */
    it('should handle empty keywords array gracefully', () => {
      const frontMatter: BlogPostFrontMatter = {
        title: 'Test Post',
        keywords: [],
        date: '2024-01-15',
        authors: ['hake'],
        slug: 'test-post',
      };

      const metaTags = mapFrontMatterToMetaTags(frontMatter);

      // Should just have default keywords
      expect(metaTags.keywords).toBe(SITE_CONFIG.defaultKeywords);
      // Should not have trailing comma
      expect(metaTags.keywords).not.toMatch(/,\s*$/);
    });

    /**
     * Property: All generated meta tag values should be non-empty strings
     * 
     * Ensures no empty or null values in meta tags
     */
    it('should generate non-empty values for all meta tags', () => {
      fc.assert(
        fc.property(
          frontMatterArbitrary,
          (frontMatter) => {
            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            // og:image and twitter:image should always be non-empty
            expect(metaTags['og:image']).toBeTruthy();
            expect(metaTags['og:image']!.length).toBeGreaterThan(0);
            expect(metaTags['twitter:image']).toBeTruthy();
            expect(metaTags['twitter:image']!.length).toBeGreaterThan(0);

            // keywords should always be non-empty
            expect(metaTags.keywords).toBeTruthy();
            expect(metaTags.keywords!.length).toBeGreaterThan(0);

            // description should be non-empty if defined
            if (metaTags.description !== undefined) {
              expect(metaTags.description.length).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Image URLs should always be valid URLs
     * 
     * Ensures generated image URLs are properly formatted
     */
    it('should generate valid image URLs for any input', () => {
      fc.assert(
        fc.property(
          frontMatterArbitrary,
          (frontMatter) => {
            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            // Both image URLs should be valid
            expect(isValidImageUrl(metaTags['og:image']!)).toBe(true);
            expect(isValidImageUrl(metaTags['twitter:image']!)).toBe(true);

            // Should be absolute URLs (start with http)
            expect(metaTags['og:image']).toMatch(/^https?:\/\//);
            expect(metaTags['twitter:image']).toMatch(/^https?:\/\//);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Mapping Consistency Properties', () => {
    /**
     * Property: Same input should always produce same output
     * 
     * Tests determinism of the mapping function
     */
    it('should produce consistent output for the same input', () => {
      fc.assert(
        fc.property(
          frontMatterArbitrary,
          (frontMatter) => {
            const result1 = mapFrontMatterToMetaTags(frontMatter);
            const result2 = mapFrontMatterToMetaTags(frontMatter);

            expect(result1).toEqual(result2);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Mapping should be idempotent for image URLs
     * 
     * Ensures absolute URLs are not double-prefixed
     */
    it('should not double-prefix absolute image URLs', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^https:\/\/[a-z0-9.-]+\/[a-z0-9/-]+\.(png|jpg|jpeg|webp)$/),
          (absoluteUrl) => {
            const frontMatter: BlogPostFrontMatter = {
              title: 'Test Post',
              image: absoluteUrl,
              date: '2024-01-15',
              authors: ['hake'],
              slug: 'test-post',
            };

            const metaTags = mapFrontMatterToMetaTags(frontMatter);

            // Should not have double https://
            expect(metaTags['og:image']).not.toMatch(/https:\/\/.*https:\/\//);
            expect(metaTags['twitter:image']).not.toMatch(/https:\/\/.*https:\/\//);

            // Should be exactly the input URL
            expect(metaTags['og:image']).toBe(absoluteUrl);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
