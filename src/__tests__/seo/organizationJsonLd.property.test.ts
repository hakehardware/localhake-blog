import { describe, it, expect, beforeAll } from 'vitest';
import fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Property-based tests for Organization JSON-LD Structured Data
 * 
 * Feature: seo-enhancements
 * Property 2: Organization JSON-LD Completeness
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
 * 
 * *For any* page in the site, the rendered HTML should contain a valid JSON-LD script
 * with `@type: Organization` that includes:
 * - `name` = `Localhake`
 * - `url` = `https://blog.localhake.com`
 * - `logo` property with valid URL
 * - `sameAs` array containing YouTube and GitHub URLs
 * 
 * Since these are configuration-level tests, we verify the docusaurus.config.ts
 * contains the correct Organization JSON-LD configuration that Docusaurus will
 * inject into all pages via headTags.
 */

/**
 * Interface representing the Organization JSON-LD schema
 */
interface OrganizationJsonLd {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}

/**
 * Interface representing a headTag configuration in Docusaurus
 */
interface HeadTagConfig {
  tagName: string;
  attributes: Record<string, string>;
  innerHTML: string;
}

/**
 * Expected values for Organization JSON-LD based on requirements
 */
const EXPECTED_ORGANIZATION = {
  context: 'https://schema.org',
  type: 'Organization',
  name: 'Localhake',
  url: 'https://blog.localhake.com',
  sameAs: {
    youtube: 'https://youtube.com/@HakeHardware',
    github: 'https://github.com/hakehardware/localhake-blog',
  },
};

/**
 * Required fields that must be present in Organization JSON-LD
 */
const REQUIRED_ORGANIZATION_FIELDS = ['@context', '@type', 'name', 'url', 'logo', 'sameAs'];

/**
 * Parses the docusaurus.config.ts file and extracts the headTags configuration
 */
function parseHeadTagsFromConfig(configContent: string): HeadTagConfig[] {
  // Extract the headTags array from the config
  const headTagsMatch = configContent.match(/headTags:\s*\[([\s\S]*?)\],\s*\n\s*\/\//);
  if (!headTagsMatch) {
    // Try alternative pattern without trailing comment
    const altMatch = configContent.match(/headTags:\s*\[([\s\S]*?)\],\s*\n\s*future:/);
    if (!altMatch) {
      throw new Error('Could not find headTags configuration in docusaurus.config.ts');
    }
    return parseHeadTagsContent(altMatch[1]);
  }
  return parseHeadTagsContent(headTagsMatch[1]);
}

/**
 * Parses the headTags content string into structured objects
 */
function parseHeadTagsContent(content: string): HeadTagConfig[] {
  const headTags: HeadTagConfig[] = [];
  
  // Find JSON.stringify calls which contain our JSON-LD
  const jsonStringifyMatch = content.match(/JSON\.stringify\(\{([\s\S]*?)\}\)/);
  if (jsonStringifyMatch) {
    // Extract the object content and parse it
    const objectContent = `{${jsonStringifyMatch[1]}}`;
    // Clean up the content for JSON parsing
    const cleanedContent = objectContent
      .replace(/'/g, '"')
      .replace(/,\s*\}/g, '}')
      .replace(/,\s*\]/g, ']');
    
    try {
      const jsonLd = JSON.parse(cleanedContent);
      headTags.push({
        tagName: 'script',
        attributes: { type: 'application/ld+json' },
        innerHTML: JSON.stringify(jsonLd),
      });
    } catch {
      // If parsing fails, try to extract values directly from the config
      const extractedJsonLd = extractJsonLdFromConfig(content);
      if (extractedJsonLd) {
        headTags.push({
          tagName: 'script',
          attributes: { type: 'application/ld+json' },
          innerHTML: JSON.stringify(extractedJsonLd),
        });
      }
    }
  }
  
  return headTags;
}

/**
 * Extracts JSON-LD values directly from config content using regex
 */
function extractJsonLdFromConfig(content: string): OrganizationJsonLd | null {
  const contextMatch = content.match(/'@context':\s*'([^']+)'/);
  const typeMatch = content.match(/'@type':\s*'([^']+)'/);
  const nameMatch = content.match(/name:\s*'([^']+)'/);
  const urlMatch = content.match(/url:\s*'([^']+)'/);
  const logoMatch = content.match(/logo:\s*'([^']+)'/);
  
  // Extract sameAs array
  const sameAsMatch = content.match(/sameAs:\s*\[([\s\S]*?)\]/);
  let sameAs: string[] = [];
  if (sameAsMatch) {
    const urlMatches = sameAsMatch[1].match(/'([^']+)'/g);
    if (urlMatches) {
      sameAs = urlMatches.map(u => u.replace(/'/g, ''));
    }
  }
  
  if (contextMatch && typeMatch && nameMatch && urlMatch && logoMatch) {
    return {
      '@context': contextMatch[1],
      '@type': typeMatch[1],
      name: nameMatch[1],
      url: urlMatch[1],
      logo: logoMatch[1],
      sameAs,
    };
  }
  
  return null;
}

/**
 * Finds the Organization JSON-LD script tag from headTags
 */
function findOrganizationJsonLd(headTags: HeadTagConfig[]): OrganizationJsonLd | null {
  for (const tag of headTags) {
    if (tag.tagName === 'script' && tag.attributes.type === 'application/ld+json') {
      try {
        const jsonLd = JSON.parse(tag.innerHTML);
        if (jsonLd['@type'] === 'Organization') {
          return jsonLd as OrganizationJsonLd;
        }
      } catch {
        continue;
      }
    }
  }
  return null;
}

/**
 * Alternative: Parse Organization JSON-LD directly from config file
 */
function parseOrganizationJsonLdDirect(configContent: string): OrganizationJsonLd | null {
  // Look for the JSON.stringify block containing Organization schema
  const jsonLdBlockMatch = configContent.match(
    /innerHTML:\s*JSON\.stringify\(\{[\s\S]*?'@type':\s*'Organization'[\s\S]*?\}\)/
  );
  
  if (!jsonLdBlockMatch) {
    return null;
  }
  
  // Extract individual fields using regex
  const block = jsonLdBlockMatch[0];
  
  const contextMatch = block.match(/'@context':\s*'([^']+)'/);
  const typeMatch = block.match(/'@type':\s*'([^']+)'/);
  const nameMatch = block.match(/name:\s*'([^']+)'/);
  const urlMatch = block.match(/url:\s*'([^']+)'/);
  const logoMatch = block.match(/logo:\s*'([^']+)'/);
  
  // Extract sameAs array
  const sameAsMatch = block.match(/sameAs:\s*\[([\s\S]*?)\]/);
  let sameAs: string[] = [];
  if (sameAsMatch) {
    const urlMatches = sameAsMatch[1].match(/'([^']+)'/g);
    if (urlMatches) {
      sameAs = urlMatches.map(u => u.replace(/'/g, ''));
    }
  }
  
  if (contextMatch && typeMatch && nameMatch && urlMatch && logoMatch) {
    return {
      '@context': contextMatch[1],
      '@type': typeMatch[1],
      name: nameMatch[1],
      url: urlMatch[1],
      logo: logoMatch[1],
      sameAs,
    };
  }
  
  return null;
}

describe('Organization JSON-LD Property Tests', () => {
  let configContent: string;
  let organizationJsonLd: OrganizationJsonLd | null;

  beforeAll(() => {
    // Read the docusaurus.config.ts file
    const configPath = path.resolve(__dirname, '../../../docusaurus.config.ts');
    configContent = fs.readFileSync(configPath, 'utf-8');
    
    // Try to parse Organization JSON-LD directly from config
    organizationJsonLd = parseOrganizationJsonLdDirect(configContent);
    
    // Fallback to headTags parsing if direct parsing fails
    if (!organizationJsonLd) {
      const headTags = parseHeadTagsFromConfig(configContent);
      organizationJsonLd = findOrganizationJsonLd(headTags);
    }
  });

  describe('Property 2: Organization JSON-LD Completeness', () => {
    /**
     * Property: Organization JSON-LD should be present in the configuration
     * 
     * **Validates: Requirement 2.1**
     * THE SEO_System SHALL include JSON-LD Organization schema on all pages
     */
    it('should have Organization JSON-LD configured in headTags', () => {
      expect(organizationJsonLd).not.toBeNull();
      expect(organizationJsonLd?.['@type']).toBe('Organization');
    });

    /**
     * Property: Organization name should be "Localhake"
     * 
     * **Validates: Requirement 2.2**
     * THE Organization schema SHALL include the organization name "Localhake"
     */
    it('should have organization name set to Localhake', () => {
      expect(organizationJsonLd).not.toBeNull();
      expect(organizationJsonLd?.name).toBe(EXPECTED_ORGANIZATION.name);
    });

    /**
     * Property: Organization URL should be the site URL
     * 
     * **Validates: Requirement 2.3**
     * THE Organization schema SHALL include the site URL `https://blog.localhake.com`
     */
    it('should have organization URL set to site URL', () => {
      expect(organizationJsonLd).not.toBeNull();
      expect(organizationJsonLd?.url).toBe(EXPECTED_ORGANIZATION.url);
    });

    /**
     * Property: Organization should have a logo reference
     * 
     * **Validates: Requirement 2.4**
     * THE Organization schema SHALL include a logo reference
     */
    it('should have a logo property with valid URL', () => {
      expect(organizationJsonLd).not.toBeNull();
      expect(organizationJsonLd?.logo).toBeDefined();
      expect(organizationJsonLd?.logo).toBeTruthy();
      
      // Logo should be a valid URL
      expect(organizationJsonLd?.logo).toMatch(/^https?:\/\/.+/);
      
      // Logo should be on the same domain
      expect(organizationJsonLd?.logo).toContain('blog.localhake.com');
    });

    /**
     * Property: Organization should have sameAs links to YouTube and GitHub
     * 
     * **Validates: Requirement 2.5**
     * THE Organization schema SHALL include sameAs links to the YouTube channel
     * (`https://youtube.com/@HakeHardware`) and GitHub
     * (`https://github.com/hakehardware/localhake-blog`)
     */
    it('should have sameAs array with YouTube and GitHub URLs', () => {
      expect(organizationJsonLd).not.toBeNull();
      expect(organizationJsonLd?.sameAs).toBeDefined();
      expect(Array.isArray(organizationJsonLd?.sameAs)).toBe(true);
      expect(organizationJsonLd?.sameAs.length).toBeGreaterThanOrEqual(2);
      
      // Should contain YouTube URL
      expect(organizationJsonLd?.sameAs).toContain(EXPECTED_ORGANIZATION.sameAs.youtube);
      
      // Should contain GitHub URL
      expect(organizationJsonLd?.sameAs).toContain(EXPECTED_ORGANIZATION.sameAs.github);
    });

    /**
     * Property: For any required field, it should be present in Organization JSON-LD
     * 
     * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
     * Uses property-based testing to verify each required field is present
     */
    it('should contain all required fields for any field in the required set', () => {
      expect(organizationJsonLd).not.toBeNull();
      
      fc.assert(
        fc.property(
          fc.constantFrom(...REQUIRED_ORGANIZATION_FIELDS),
          (field) => {
            expect(organizationJsonLd).toHaveProperty(field);
            const value = organizationJsonLd?.[field as keyof OrganizationJsonLd];
            expect(value).toBeDefined();
            expect(value).toBeTruthy();
          }
        ),
        { numRuns: REQUIRED_ORGANIZATION_FIELDS.length }
      );
    });

    /**
     * Property: For any sameAs URL, it should be a valid URL
     * 
     * **Validates: Requirement 2.5**
     * Uses property-based testing to verify each sameAs URL is valid
     */
    it('should have valid URLs for all sameAs entries', () => {
      expect(organizationJsonLd).not.toBeNull();
      expect(organizationJsonLd?.sameAs).toBeDefined();
      
      fc.assert(
        fc.property(
          fc.constantFrom(...(organizationJsonLd?.sameAs || [])),
          (url) => {
            // Each URL should be a valid HTTPS URL
            expect(url).toMatch(/^https:\/\/.+/);
            // Each URL should not be empty
            expect(url.length).toBeGreaterThan(10);
          }
        ),
        { numRuns: organizationJsonLd?.sameAs?.length || 1 }
      );
    });

    /**
     * Property: Organization JSON-LD should have valid schema.org context
     * 
     * **Validates: Requirement 2.1**
     * Ensures the JSON-LD uses proper schema.org context
     */
    it('should have valid schema.org context', () => {
      expect(organizationJsonLd).not.toBeNull();
      expect(organizationJsonLd?.['@context']).toBe(EXPECTED_ORGANIZATION.context);
    });
  });

  describe('Organization JSON-LD Validation Properties', () => {
    /**
     * Property: Organization JSON-LD should produce valid JSON when stringified
     * 
     * Ensures the JSON-LD can be properly serialized for injection into HTML
     */
    it('should produce valid JSON when stringified', () => {
      expect(organizationJsonLd).not.toBeNull();
      
      // Should not throw when stringifying
      const jsonString = JSON.stringify(organizationJsonLd);
      expect(jsonString).toBeTruthy();
      
      // Should be parseable back to the same object
      const parsed = JSON.parse(jsonString);
      expect(parsed).toEqual(organizationJsonLd);
    });

    /**
     * Property: Logo URL should point to an image file
     * 
     * **Validates: Requirement 2.4**
     * Ensures the logo URL references an actual image
     */
    it('should have logo URL pointing to an image file', () => {
      expect(organizationJsonLd).not.toBeNull();
      expect(organizationJsonLd?.logo).toBeDefined();
      
      // Logo should reference an image file (common image extensions)
      expect(organizationJsonLd?.logo).toMatch(/\.(png|jpg|jpeg|svg|webp|gif)$/i);
    });

    /**
     * Property: Organization URL should match the site's configured URL
     * 
     * **Validates: Requirement 2.3**
     * Ensures consistency between Organization URL and site URL
     */
    it('should have organization URL matching site configuration', () => {
      expect(organizationJsonLd).not.toBeNull();
      
      // Extract site URL from config
      const siteUrlMatch = configContent.match(/url:\s*'([^']+)'/);
      expect(siteUrlMatch).toBeDefined();
      
      const siteUrl = siteUrlMatch?.[1];
      expect(organizationJsonLd?.url).toBe(siteUrl);
    });

    /**
     * Property: sameAs URLs should be unique
     * 
     * **Validates: Requirement 2.5**
     * Ensures no duplicate social links
     */
    it('should have unique sameAs URLs', () => {
      expect(organizationJsonLd).not.toBeNull();
      expect(organizationJsonLd?.sameAs).toBeDefined();
      
      const uniqueUrls = new Set(organizationJsonLd?.sameAs);
      expect(uniqueUrls.size).toBe(organizationJsonLd?.sameAs?.length);
    });

    /**
     * Property: sameAs should contain expected social platform URLs
     * 
     * **Validates: Requirement 2.5**
     * Uses property-based testing to verify expected platforms are present
     */
    it('should contain all expected social platform URLs', () => {
      expect(organizationJsonLd).not.toBeNull();
      
      const expectedUrls = Object.values(EXPECTED_ORGANIZATION.sameAs);
      
      fc.assert(
        fc.property(
          fc.constantFrom(...expectedUrls),
          (expectedUrl) => {
            expect(organizationJsonLd?.sameAs).toContain(expectedUrl);
          }
        ),
        { numRuns: expectedUrls.length }
      );
    });
  });

  describe('Edge Case Properties', () => {
    /**
     * Property: Organization name should not be empty
     * 
     * Ensures the organization name is meaningful
     */
    it('should have non-empty organization name', () => {
      expect(organizationJsonLd).not.toBeNull();
      expect(organizationJsonLd?.name).toBeTruthy();
      expect(organizationJsonLd?.name.trim().length).toBeGreaterThan(0);
    });

    /**
     * Property: Organization URL should be a valid HTTPS URL
     * 
     * Ensures the URL uses secure protocol
     */
    it('should have HTTPS URL for organization', () => {
      expect(organizationJsonLd).not.toBeNull();
      expect(organizationJsonLd?.url).toMatch(/^https:\/\//);
    });

    /**
     * Property: Logo URL should be an absolute URL
     * 
     * Ensures the logo URL is fully qualified for external use
     */
    it('should have absolute URL for logo', () => {
      expect(organizationJsonLd).not.toBeNull();
      expect(organizationJsonLd?.logo).toMatch(/^https?:\/\//);
    });

    /**
     * Property: sameAs array should not be empty
     * 
     * Ensures at least one social link is present
     */
    it('should have at least one sameAs URL', () => {
      expect(organizationJsonLd).not.toBeNull();
      expect(organizationJsonLd?.sameAs).toBeDefined();
      expect(organizationJsonLd?.sameAs?.length).toBeGreaterThan(0);
    });

    /**
     * Property: All string values should be properly trimmed
     * 
     * Ensures no leading/trailing whitespace in values
     */
    it('should have properly trimmed string values', () => {
      expect(organizationJsonLd).not.toBeNull();
      
      const stringFields = ['@context', '@type', 'name', 'url', 'logo'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...stringFields),
          (field) => {
            const value = organizationJsonLd?.[field as keyof OrganizationJsonLd];
            if (typeof value === 'string') {
              expect(value).toBe(value.trim());
            }
          }
        ),
        { numRuns: stringFields.length }
      );
    });
  });
});
