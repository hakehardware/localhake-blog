import { describe, it, expect, beforeAll } from 'vitest';
import fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Property-based tests for Global Meta Tags Configuration
 * 
 * Feature: seo-enhancements
 * Property 1: Global Meta Tags Presence and Correctness
 * 
 * **Validates: Requirements 1.1, 1.3, 1.4, 1.6**
 * 
 * *For any* rendered page in the site, the HTML head should contain all required
 * global meta tags with their correct values:
 * - `twitter:card` = `summary_large_image`
 * - `robots` containing `max-image-preview:large`
 * - `keywords` containing homelab-related terms
 * - `og:site_name` = `Localhake`
 * 
 * Since these are configuration-level tests, we verify the docusaurus.config.ts
 * contains the correct metadata configuration that Docusaurus will apply to all pages.
 */

/**
 * Interface representing a meta tag configuration in Docusaurus
 */
interface MetaTagConfig {
  name?: string;
  property?: string;
  content: string;
}

/**
 * Interface representing the themeConfig.metadata structure
 */
interface ThemeConfigMetadata {
  metadata: MetaTagConfig[];
  image?: string;
}

/**
 * Parses the docusaurus.config.ts file and extracts the metadata configuration
 * This is a simplified parser that extracts the metadata array from the config
 */
function parseDocusaurusConfig(configContent: string): ThemeConfigMetadata {
  // Extract the metadata array from themeConfig
  const metadataMatch = configContent.match(/metadata:\s*\[([\s\S]*?)\],/);
  if (!metadataMatch) {
    throw new Error('Could not find metadata configuration in docusaurus.config.ts');
  }

  const metadataStr = metadataMatch[1];
  const metadata: MetaTagConfig[] = [];

  // Parse each meta tag object
  // Match patterns like { name: 'twitter:card', content: 'summary_large_image' }
  const tagRegex = /\{\s*(?:name|property):\s*['"]([^'"]+)['"]\s*,\s*content:\s*['"]([^'"]+)['"]\s*\}/g;
  let match;
  while ((match = tagRegex.exec(metadataStr)) !== null) {
    const key = metadataStr.slice(match.index, match.index + 20).includes('property:') ? 'property' : 'name';
    metadata.push({
      [key]: match[1],
      content: match[2],
    } as MetaTagConfig);
  }

  // Extract the image configuration
  const imageMatch = configContent.match(/image:\s*['"]([^'"]+)['"]/);
  const image = imageMatch ? imageMatch[1] : undefined;

  return { metadata, image };
}

/**
 * Finds a meta tag by name in the metadata array
 */
function findMetaTagByName(metadata: MetaTagConfig[], name: string): MetaTagConfig | undefined {
  return metadata.find(tag => tag.name === name);
}

/**
 * Required homelab-related keywords that should be present
 */
const REQUIRED_KEYWORDS = ['homelab', 'self-hosted', 'proxmox', 'docker', 'tutorials'];

/**
 * Expected meta tag values based on requirements
 */
const EXPECTED_META_TAGS = {
  'twitter:card': 'summary_large_image',
  'robots': 'max-image-preview:large',
};

describe('Global Meta Tags Property Tests', () => {
  let configContent: string;
  let themeConfig: ThemeConfigMetadata;

  beforeAll(() => {
    // Read the docusaurus.config.ts file
    const configPath = path.resolve(__dirname, '../../../docusaurus.config.ts');
    configContent = fs.readFileSync(configPath, 'utf-8');
    themeConfig = parseDocusaurusConfig(configContent);
  });

  describe('Property 1: Global Meta Tags Presence and Correctness', () => {
    /**
     * Property: twitter:card meta tag should be set to summary_large_image
     * 
     * **Validates: Requirement 1.1**
     * THE SEO_System SHALL include Twitter card meta tags with `twitter:card` set to `summary_large_image` as the default
     */
    it('should have twitter:card set to summary_large_image', () => {
      const twitterCardTag = findMetaTagByName(themeConfig.metadata, 'twitter:card');
      
      expect(twitterCardTag).toBeDefined();
      expect(twitterCardTag?.content).toBe('summary_large_image');
    });

    /**
     * Property: robots meta tag should contain max-image-preview:large
     * 
     * **Validates: Requirement 1.3**
     * THE SEO_System SHALL include a `robots` meta tag with `max-image-preview:large` to optimize for Google Discover
     */
    it('should have robots meta tag with max-image-preview:large', () => {
      const robotsTag = findMetaTagByName(themeConfig.metadata, 'robots');
      
      expect(robotsTag).toBeDefined();
      expect(robotsTag?.content).toContain('max-image-preview:large');
    });

    /**
     * Property: keywords meta tag should contain homelab-related terms
     * 
     * **Validates: Requirement 1.4**
     * THE SEO_System SHALL include site-wide default keywords relevant to homelab, self-hosting, and Proxmox tutorials
     */
    it('should have keywords meta tag with homelab-related terms', () => {
      const keywordsTag = findMetaTagByName(themeConfig.metadata, 'keywords');
      
      expect(keywordsTag).toBeDefined();
      
      // Verify all required keywords are present
      for (const keyword of REQUIRED_KEYWORDS) {
        expect(keywordsTag?.content.toLowerCase()).toContain(keyword.toLowerCase());
      }
    });

    /**
     * Property: For any required keyword, it should be present in the keywords meta tag
     * 
     * **Validates: Requirement 1.4**
     * Uses property-based testing to verify each required keyword is present
     */
    it('should contain each required keyword for any keyword in the required set', () => {
      const keywordsTag = findMetaTagByName(themeConfig.metadata, 'keywords');
      expect(keywordsTag).toBeDefined();
      
      fc.assert(
        fc.property(
          fc.constantFrom(...REQUIRED_KEYWORDS),
          (keyword) => {
            expect(keywordsTag?.content.toLowerCase()).toContain(keyword.toLowerCase());
          }
        ),
        { numRuns: REQUIRED_KEYWORDS.length }
      );
    });

    /**
     * Property: og:site_name should be set to Localhake
     * 
     * **Validates: Requirement 1.6**
     * THE SEO_System SHALL include `og:site_name` set to "Localhake"
     * 
     * Note: In Docusaurus, og:site_name is automatically generated from the site title
     * We verify the site title is set to "Localhake" in the config
     */
    it('should have site title set to Localhake (used for og:site_name)', () => {
      // Docusaurus uses the site title for og:site_name
      const titleMatch = configContent.match(/title:\s*['"]([^'"]+)['"]/);
      
      expect(titleMatch).toBeDefined();
      expect(titleMatch?.[1]).toBe('Localhake');
    });

    /**
     * Property: All required meta tags should be present in the configuration
     * 
     * **Validates: Requirements 1.1, 1.3, 1.4**
     * Comprehensive property test that verifies all required meta tags exist
     */
    it('should have all required meta tags present', () => {
      const requiredMetaTags = ['twitter:card', 'robots', 'keywords'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...requiredMetaTags),
          (tagName) => {
            const tag = findMetaTagByName(themeConfig.metadata, tagName);
            expect(tag).toBeDefined();
            expect(tag?.content).toBeTruthy();
          }
        ),
        { numRuns: requiredMetaTags.length }
      );
    });

    /**
     * Property: For any expected meta tag value, the configuration should match
     * 
     * **Validates: Requirements 1.1, 1.3**
     * Uses property-based testing to verify each expected value matches
     */
    it('should have correct values for all expected meta tags', () => {
      const expectedEntries = Object.entries(EXPECTED_META_TAGS);
      
      fc.assert(
        fc.property(
          fc.constantFrom(...expectedEntries),
          ([tagName, expectedValue]) => {
            const tag = findMetaTagByName(themeConfig.metadata, tagName);
            expect(tag).toBeDefined();
            
            if (tagName === 'robots') {
              // robots tag should contain the expected value (may have additional directives)
              expect(tag?.content).toContain(expectedValue);
            } else {
              // Other tags should match exactly
              expect(tag?.content).toBe(expectedValue);
            }
          }
        ),
        { numRuns: expectedEntries.length }
      );
    });
  });

  describe('Edge Case Properties', () => {
    /**
     * Property: Meta tag values should not be empty strings
     * 
     * Ensures all configured meta tags have meaningful content
     */
    it('should have non-empty content for all meta tags', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...themeConfig.metadata),
          (tag) => {
            expect(tag.content).toBeTruthy();
            expect(tag.content.trim().length).toBeGreaterThan(0);
          }
        ),
        { numRuns: themeConfig.metadata.length }
      );
    });

    /**
     * Property: Keywords should be comma-separated and properly formatted
     * 
     * **Validates: Requirement 1.4**
     * Ensures keywords are in a valid format for meta tags
     */
    it('should have properly formatted keywords', () => {
      const keywordsTag = findMetaTagByName(themeConfig.metadata, 'keywords');
      expect(keywordsTag).toBeDefined();
      
      const keywords = keywordsTag!.content.split(',').map(k => k.trim());
      
      fc.assert(
        fc.property(
          fc.constantFrom(...keywords),
          (keyword) => {
            // Each keyword should be non-empty
            expect(keyword.length).toBeGreaterThan(0);
            // Keywords should not have leading/trailing whitespace after trim
            expect(keyword).toBe(keyword.trim());
          }
        ),
        { numRuns: keywords.length }
      );
    });

    /**
     * Property: twitter:site should be a valid Twitter handle if present
     * 
     * Additional validation for Twitter-related meta tags
     */
    it('should have valid twitter:site handle if present', () => {
      const twitterSiteTag = findMetaTagByName(themeConfig.metadata, 'twitter:site');
      
      if (twitterSiteTag) {
        // Twitter handles should start with @
        expect(twitterSiteTag.content).toMatch(/^@\w+$/);
      }
    });

    /**
     * Property: Social card image should be configured
     * 
     * **Validates: Requirement 5.1**
     * THE SEO_System SHALL have a default site-wide social card image configured
     */
    it('should have a default social card image configured', () => {
      expect(themeConfig.image).toBeDefined();
      expect(themeConfig.image).toBeTruthy();
      // Image should be a valid path
      expect(themeConfig.image).toMatch(/^img\/.*\.(png|jpg|jpeg|webp)$/);
    });
  });

  describe('Configuration Consistency Properties', () => {
    /**
     * Property: Meta tag names should be unique
     * 
     * Ensures no duplicate meta tag configurations
     */
    it('should have unique meta tag names', () => {
      const names = themeConfig.metadata
        .filter(tag => tag.name)
        .map(tag => tag.name);
      
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    /**
     * Property: All meta tags should have either name or property attribute
     * 
     * Ensures valid meta tag structure
     */
    it('should have valid meta tag structure', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...themeConfig.metadata),
          (tag) => {
            // Each tag should have either name or property
            expect(tag.name || tag.property).toBeTruthy();
            // Each tag should have content
            expect(tag.content).toBeTruthy();
          }
        ),
        { numRuns: themeConfig.metadata.length }
      );
    });
  });
});
