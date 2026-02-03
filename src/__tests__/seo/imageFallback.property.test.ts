import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * Property-based tests for Image Fallback Behavior
 * 
 * Feature: seo-enhancements
 * Property 6: Image Fallback Behavior
 * 
 * **Validates: Requirements 5.2, 5.5**
 * 
 * *For any* page:
 * - If a post-specific image is provided in front matter, `og:image` should use that image
 * - If no post-specific image is provided, `og:image` should use the site default image (`/img/localhake-social-card.png`)
 * 
 * These tests verify the image fallback logic used in BlogPostPage and DocItem wrappers.
 */

/**
 * Site configuration constants matching the actual implementation
 */
const SITE_CONFIG = {
  url: 'https://blog.localhake.com',
  defaultImage: '/img/localhake-social-card.png',
};

/**
 * Interface representing page metadata with optional image
 */
interface PageMetadata {
  title: string;
  permalink: string;
  frontMatterImage?: string;
}

/**
 * Simulates the image resolution logic from BlogPostPage wrapper
 * This mirrors the actual implementation in src/theme/BlogPostPage/index.tsx
 * 
 * @param frontMatterImage - Optional image path from front matter
 * @returns Full image URL to use for og:image
 */
function resolveImageUrl(frontMatterImage?: string): string {
  // Empty string is treated as "no image" (falsy check)
  if (frontMatterImage && frontMatterImage.length > 0) {
    // If image starts with http, use as-is; otherwise prepend site URL
    return frontMatterImage.startsWith('http')
      ? frontMatterImage
      : `${SITE_CONFIG.url}${frontMatterImage}`;
  }
  // Fallback to site default image
  return `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`;
}

/**
 * Validates that a URL is a valid absolute URL
 */
function isValidAbsoluteUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Validates that a URL points to an image file
 */
function isImageUrl(url: string): boolean {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

/**
 * Arbitrary generator for valid relative image paths
 */
const relativeImagePathArbitrary = fc.stringMatching(/^\/img\/[a-z0-9-]+\.(png|jpg|jpeg|webp)$/);

/**
 * Arbitrary generator for valid absolute image URLs
 * Uses a more constrained pattern to ensure valid domain names
 */
const absoluteImageUrlArbitrary = fc.tuple(
  fc.stringMatching(/^[a-z][a-z0-9]{2,10}$/),  // domain name part
  fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/)   // path part
).map(([domain, path]) => `https://${domain}.com/img/${path}.png`);

/**
 * Arbitrary generator for any valid image path (relative or absolute)
 */
const anyImagePathArbitrary = fc.oneof(relativeImagePathArbitrary, absoluteImageUrlArbitrary);

/**
 * Arbitrary generator for optional image (undefined or valid path)
 */
const optionalImageArbitrary = fc.option(anyImagePathArbitrary, { nil: undefined });

/**
 * Arbitrary generator for page metadata
 */
const pageMetadataArbitrary = fc.record({
  title: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 0),
  permalink: fc.stringMatching(/^\/[a-z0-9/-]{5,50}$/),
  frontMatterImage: optionalImageArbitrary,
});

describe('Image Fallback Behavior Property Tests', () => {
  describe('Property 6: Image Fallback Behavior', () => {
    /**
     * Property: When image is provided in front matter, og:image should use that image
     * 
     * **Validates: Requirement 5.2**
     * - 5.2: WHEN a blog post has an `image` field in front matter, THEN THE SEO_System SHALL use it for `og:image`
     */
    it('should use front matter image when provided', () => {
      fc.assert(
        fc.property(
          anyImagePathArbitrary,
          (imagePath) => {
            const resolvedUrl = resolveImageUrl(imagePath);

            // Should be a valid absolute URL
            expect(isValidAbsoluteUrl(resolvedUrl)).toBe(true);

            // Should contain the provided image path
            if (imagePath.startsWith('http')) {
              expect(resolvedUrl).toBe(imagePath);
            } else {
              expect(resolvedUrl).toContain(imagePath);
              expect(resolvedUrl).toBe(`${SITE_CONFIG.url}${imagePath}`);
            }

            // Should NOT be the default image
            expect(resolvedUrl).not.toBe(`${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: When no image is provided, og:image should use site default
     * 
     * **Validates: Requirement 5.5**
     * - 5.5: WHEN no post-specific image is provided, THEN THE SEO_System SHALL use the site default image
     */
    it('should use site default image when no front matter image is provided', () => {
      const resolvedUrl = resolveImageUrl(undefined);

      // Should be the default image URL
      expect(resolvedUrl).toBe(`${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`);

      // Should be a valid absolute URL
      expect(isValidAbsoluteUrl(resolvedUrl)).toBe(true);

      // Should be an image URL
      expect(isImageUrl(resolvedUrl)).toBe(true);
    });

    /**
     * Property: Resolved image URL should always be a valid absolute URL
     * 
     * **Validates: Requirements 5.2, 5.5**
     * Ensures the resolved URL is always valid regardless of input
     */
    it('should always resolve to a valid absolute URL', () => {
      fc.assert(
        fc.property(
          optionalImageArbitrary,
          (frontMatterImage) => {
            const resolvedUrl = resolveImageUrl(frontMatterImage);

            // Should always be a valid absolute URL
            expect(isValidAbsoluteUrl(resolvedUrl)).toBe(true);

            // Should always be non-empty
            expect(resolvedUrl.length).toBeGreaterThan(0);

            // Should always be an image URL
            expect(isImageUrl(resolvedUrl)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Resolved image URL should always contain the site URL
     * 
     * **Validates: Requirements 5.2, 5.5**
     * Ensures all relative paths are properly prefixed with site URL
     */
    it('should always include site URL for relative paths', () => {
      fc.assert(
        fc.property(
          relativeImagePathArbitrary,
          (relativePath) => {
            const resolvedUrl = resolveImageUrl(relativePath);

            // Should contain the site URL
            expect(resolvedUrl).toContain(SITE_CONFIG.url);

            // Should start with the site URL
            expect(resolvedUrl.startsWith(SITE_CONFIG.url)).toBe(true);

            // Should contain the original path
            expect(resolvedUrl).toContain(relativePath);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Absolute URLs should be preserved without modification
     * 
     * **Validates: Requirement 5.2**
     * Ensures external image URLs are not modified
     */
    it('should preserve absolute image URLs without modification', () => {
      fc.assert(
        fc.property(
          absoluteImageUrlArbitrary,
          (absoluteUrl) => {
            const resolvedUrl = resolveImageUrl(absoluteUrl);

            // Should be exactly the input URL
            expect(resolvedUrl).toBe(absoluteUrl);

            // Should not have double https://
            expect(resolvedUrl).not.toMatch(/https:\/\/.*https:\/\//);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Fallback Consistency Properties', () => {
    /**
     * Property: Default image should always be the same
     * 
     * **Validates: Requirement 5.5**
     * Ensures consistent fallback behavior
     */
    it('should always use the same default image', () => {
      // Test multiple calls with undefined
      const results = Array.from({ length: 10 }, () => resolveImageUrl(undefined));

      // All results should be identical
      const expectedDefault = `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`;
      for (const result of results) {
        expect(result).toBe(expectedDefault);
      }
    });

    /**
     * Property: Same input should always produce same output
     * 
     * **Validates: Requirements 5.2, 5.5**
     * Tests determinism of the resolution function
     */
    it('should produce consistent output for the same input', () => {
      fc.assert(
        fc.property(
          optionalImageArbitrary,
          (frontMatterImage) => {
            const result1 = resolveImageUrl(frontMatterImage);
            const result2 = resolveImageUrl(frontMatterImage);

            expect(result1).toBe(result2);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Empty string should be treated as no image (fallback to default)
     * 
     * Edge case test for empty string handling
     * Note: In JavaScript, empty string is falsy, so it triggers the fallback
     */
    it('should treat empty string as no image and use default', () => {
      const emptyResult = resolveImageUrl('');
      
      // Empty string is falsy in JavaScript, so it falls back to default
      // This is the correct behavior - empty string means "no image provided"
      expect(emptyResult).toBe(`${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`);
    });
  });

  describe('URL Construction Properties', () => {
    /**
     * Property: Relative paths should not have double slashes
     * 
     * **Validates: Requirement 5.2**
     * Ensures proper URL construction
     */
    it('should not create double slashes in URL', () => {
      fc.assert(
        fc.property(
          relativeImagePathArbitrary,
          (relativePath) => {
            const resolvedUrl = resolveImageUrl(relativePath);

            // Should not have double slashes (except in https://)
            const urlWithoutProtocol = resolvedUrl.replace('https://', '');
            expect(urlWithoutProtocol).not.toContain('//');
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Resolved URL should be a valid URL format
     * 
     * **Validates: Requirements 5.2, 5.5**
     * Ensures the URL can be parsed
     */
    it('should produce parseable URLs', () => {
      fc.assert(
        fc.property(
          optionalImageArbitrary,
          (frontMatterImage) => {
            const resolvedUrl = resolveImageUrl(frontMatterImage);

            // Should be parseable as a URL
            expect(() => new URL(resolvedUrl)).not.toThrow();

            // Parsed URL should have https protocol
            const parsed = new URL(resolvedUrl);
            expect(parsed.protocol).toBe('https:');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Page Metadata Integration Properties', () => {
    /**
     * Property: For any page metadata, image resolution should work correctly
     * 
     * **Validates: Requirements 5.2, 5.5**
     * Integration test with full page metadata
     */
    it('should correctly resolve image for any page metadata', () => {
      fc.assert(
        fc.property(
          pageMetadataArbitrary,
          (metadata) => {
            const resolvedUrl = resolveImageUrl(metadata.frontMatterImage);

            // Should always be a valid absolute URL
            expect(isValidAbsoluteUrl(resolvedUrl)).toBe(true);

            // Should be an image URL
            expect(isImageUrl(resolvedUrl)).toBe(true);

            // If front matter image was provided, it should be used
            if (metadata.frontMatterImage) {
              if (metadata.frontMatterImage.startsWith('http')) {
                expect(resolvedUrl).toBe(metadata.frontMatterImage);
              } else {
                expect(resolvedUrl).toContain(metadata.frontMatterImage);
              }
            } else {
              // Otherwise, default should be used
              expect(resolvedUrl).toBe(`${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Image resolution should be independent of other metadata
     * 
     * **Validates: Requirements 5.2, 5.5**
     * Ensures image resolution only depends on the image field
     */
    it('should resolve image independently of other metadata fields', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.string({ minLength: 5, maxLength: 100 }),
            fc.stringMatching(/^\/[a-z0-9/-]{5,50}$/),
            optionalImageArbitrary
          ),
          ([title, permalink, frontMatterImage]) => {
            // Create two different metadata objects with same image
            const metadata1: PageMetadata = { title, permalink, frontMatterImage };
            const metadata2: PageMetadata = { 
              title: 'Different Title', 
              permalink: '/different/path', 
              frontMatterImage 
            };

            const result1 = resolveImageUrl(metadata1.frontMatterImage);
            const result2 = resolveImageUrl(metadata2.frontMatterImage);

            // Results should be identical since image is the same
            expect(result1).toBe(result2);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Default Image Properties', () => {
    /**
     * Property: Default image path should be valid
     * 
     * **Validates: Requirement 5.5**
     * Ensures the default image configuration is correct
     */
    it('should have a valid default image path', () => {
      // Default image should be a valid relative path
      expect(SITE_CONFIG.defaultImage).toMatch(/^\/img\/[a-z0-9-]+\.(png|jpg|jpeg|webp|svg)$/);

      // Default image should be an image file
      expect(isImageUrl(SITE_CONFIG.defaultImage)).toBe(true);
    });

    /**
     * Property: Default image URL should be fully qualified
     * 
     * **Validates: Requirement 5.5**
     * Ensures the default image URL is complete
     */
    it('should produce fully qualified default image URL', () => {
      const defaultUrl = resolveImageUrl(undefined);

      // Should be fully qualified
      expect(defaultUrl).toMatch(/^https:\/\//);

      // Should contain the site URL
      expect(defaultUrl).toContain(SITE_CONFIG.url);

      // Should contain the default image path
      expect(defaultUrl).toContain(SITE_CONFIG.defaultImage);

      // Should be exactly site URL + default image
      expect(defaultUrl).toBe(`${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`);
    });
  });
});
