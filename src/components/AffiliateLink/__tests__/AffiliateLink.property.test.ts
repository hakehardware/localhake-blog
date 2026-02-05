import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { render } from '@testing-library/react';
import React from 'react';
import AffiliateLink, { parseAmazonUrl } from '../index';

/**
 * Property-based tests for Amazon Affiliate Link URL Validation
 * 
 * Feature: affiliate-link-component, Property 6: URL Validation Consistency
 * 
 * **Validates: Requirements 3.1, 3.2**
 * 
 * *For any* valid Amazon URL string, `parseAmazonUrl(url)` SHALL return an object where:
 * - `url` equals the original input URL (unchanged)
 * - `error` is null
 * 
 * This ensures the validation function doesn't modify valid URLs.
 */

/**
 * Valid Amazon short URL generator
 * Generates URLs in the format: https://amzn.to/[5-10 alphanumeric chars]
 */
const shortUrlArbitrary = fc.stringMatching(/^https:\/\/amzn\.to\/[A-Za-z0-9]{5,10}$/);

/**
 * Valid Amazon product URL generator
 * Generates URLs in the format: https://{domain}/dp/{ASIN}
 * where domain is a valid Amazon domain and ASIN is a 10-character alphanumeric code
 */
const productUrlArbitrary = fc.tuple(
  fc.constantFrom('www.amazon.com', 'amazon.com', 'www.amazon.co.uk', 'www.amazon.de'),
  fc.stringMatching(/^[A-Z0-9]{10}$/)
).map(([domain, asin]) => `https://${domain}/dp/${asin}`);

/**
 * Combined generator for any valid Amazon URL
 */
const validAmazonUrlArbitrary = fc.oneof(shortUrlArbitrary, productUrlArbitrary);

/**
 * Title generator for non-empty titles
 * Generates strings with 1-200 characters that have non-whitespace content
 */
const titleArbitrary = fc.string({ minLength: 1, maxLength: 200 })
  .filter(s => s.trim().length > 0);

describe('AffiliateLink Property Tests', () => {
  describe('Property 6: URL Validation Consistency', () => {
    /**
     * Property: For any valid Amazon short URL, parseAmazonUrl returns the URL unchanged
     * 
     * **Validates: Requirements 3.1**
     * WHEN a valid Amazon short URL (amzn.to) is provided, THE Affiliate_Link_Component SHALL accept and render it
     */
    it('should return valid Amazon short URLs unchanged with no error', () => {
      fc.assert(
        fc.property(shortUrlArbitrary, (url) => {
          const result = parseAmazonUrl(url);
          
          // URL should be returned unchanged
          expect(result.url).toBe(url);
          // Error should be null for valid URLs
          expect(result.error).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon product URL, parseAmazonUrl returns the URL unchanged
     * 
     * **Validates: Requirements 3.2**
     * WHEN a valid Amazon product URL (amazon.com, amazon.co.uk, etc.) is provided, 
     * THE Affiliate_Link_Component SHALL accept and render it
     */
    it('should return valid Amazon product URLs unchanged with no error', () => {
      fc.assert(
        fc.property(productUrlArbitrary, (url) => {
          const result = parseAmazonUrl(url);
          
          // URL should be returned unchanged
          expect(result.url).toBe(url);
          // Error should be null for valid URLs
          expect(result.error).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon URL (short or product), parseAmazonUrl returns consistent results
     * 
     * **Validates: Requirements 3.1, 3.2**
     * Combined property test ensuring URL validation consistency across all valid URL types
     */
    it('should return any valid Amazon URL unchanged with no error', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const result = parseAmazonUrl(url);
          
          // URL should be returned unchanged
          expect(result.url).toBe(url);
          // Error should be null for valid URLs
          expect(result.error).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: URL validation is idempotent - calling parseAmazonUrl multiple times
     * on the same valid URL should always return the same result
     * 
     * **Validates: Requirements 3.1, 3.2**
     */
    it('should be idempotent for valid URLs', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const result1 = parseAmazonUrl(url);
          const result2 = parseAmazonUrl(url);
          
          // Results should be identical
          expect(result1.url).toBe(result2.url);
          expect(result1.error).toBe(result2.error);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Valid URLs should never have both url and error set
     * 
     * **Validates: Requirements 3.1, 3.2**
     * Ensures the return type invariant: either url is set and error is null,
     * or url is null and error is set
     */
    it('should have mutually exclusive url and error for valid URLs', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const result = parseAmazonUrl(url);
          
          // For valid URLs: url should be set, error should be null
          expect(result.url).not.toBeNull();
          expect(result.error).toBeNull();
          
          // They should be mutually exclusive
          const hasUrl = result.url !== null;
          const hasError = result.error !== null;
          expect(hasUrl).not.toBe(hasError);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: affiliate-link-component, Property 1: Valid URL Rendering
   * 
   * **Validates: Requirements 1.1, 3.1, 3.2**
   * 
   * *For any* valid Amazon URL (either short URL like `amzn.to/xxx` or product URL 
   * like `amazon.com/dp/xxx`), the component SHALL render a clickable anchor element 
   * with the URL as the href.
   */
  describe('Property 1: Valid URL Rendering', () => {
    /**
     * Property: For any valid Amazon short URL, the component renders an anchor with correct href
     * 
     * **Validates: Requirements 1.1, 3.1**
     * WHEN a valid Amazon short URL (amzn.to) is provided, THE Affiliate_Link_Component 
     * SHALL render a clickable link
     */
    it('should render anchor element with correct href for valid Amazon short URLs', () => {
      fc.assert(
        fc.property(shortUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Find the anchor element
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Anchor href should match the provided URL
          expect(anchor?.getAttribute('href')).toBe(url);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon product URL, the component renders an anchor with correct href
     * 
     * **Validates: Requirements 1.1, 3.2**
     * WHEN a valid Amazon product URL (amazon.com, amazon.co.uk, etc.) is provided, 
     * THE Affiliate_Link_Component SHALL render a clickable link
     */
    it('should render anchor element with correct href for valid Amazon product URLs', () => {
      fc.assert(
        fc.property(productUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Find the anchor element
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Anchor href should match the provided URL
          expect(anchor?.getAttribute('href')).toBe(url);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon URL (short or product), the component renders a clickable anchor
     * 
     * **Validates: Requirements 1.1, 3.1, 3.2**
     * Combined property test ensuring valid URL rendering across all valid URL types
     */
    it('should render anchor element with correct href for any valid Amazon URL', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Find the anchor element
          const anchor = container.querySelector('a');
          
          // Anchor should exist (component renders a clickable link)
          expect(anchor).not.toBeNull();
          
          // Anchor href should match the provided URL exactly
          expect(anchor?.getAttribute('href')).toBe(url);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: The rendered anchor element should be a valid clickable link
     * 
     * **Validates: Requirement 1.1**
     * Ensures the anchor element has the necessary attributes to be clickable
     */
    it('should render a valid clickable anchor element for any valid Amazon URL', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Anchor should have href attribute (making it clickable)
          expect(anchor?.hasAttribute('href')).toBe(true);
          
          // href should be a non-empty string
          const href = anchor?.getAttribute('href');
          expect(href).toBeTruthy();
          expect(typeof href).toBe('string');
          expect(href!.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: URL in href should not be modified by the component
     * 
     * **Validates: Requirements 1.1, 3.1, 3.2**
     * Ensures the component preserves the URL exactly as provided
     */
    it('should preserve the URL exactly as provided in the href attribute', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          const href = anchor?.getAttribute('href');
          
          // URL should be preserved exactly (not encoded, modified, or normalized)
          expect(href).toBe(url);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Component should render exactly one anchor element for valid URLs
     * 
     * **Validates: Requirement 1.1**
     * Ensures the component doesn't render multiple links or no links
     */
    it('should render exactly one anchor element for any valid Amazon URL', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchors = container.querySelectorAll('a');
          
          // Should have exactly one anchor element
          expect(anchors.length).toBe(1);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: affiliate-link-component, Property 2: Anchor Attributes Correctness
   * 
   * **Validates: Requirements 1.2, 1.3, 2.5, 6.1, 6.4**
   * 
   * *For any* valid Amazon URL, the rendered anchor element SHALL have:
   * - `target="_blank"` to open in new tab
   * - `rel="noopener sponsored"` for security and FTC compliance
   * - An `aria-label` that indicates the link is an affiliate link and opens in a new tab
   */
  describe('Property 2: Anchor Attributes Correctness', () => {
    /**
     * Property: For any valid Amazon short URL, the anchor has target="_blank"
     * 
     * **Validates: Requirement 1.2**
     * WHEN the link is clicked, THE Affiliate_Link_Component SHALL open the Amazon URL 
     * in a new browser tab
     */
    it('should have target="_blank" attribute for valid Amazon short URLs', () => {
      fc.assert(
        fc.property(shortUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Should have target="_blank" to open in new tab
          expect(anchor?.getAttribute('target')).toBe('_blank');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon product URL, the anchor has target="_blank"
     * 
     * **Validates: Requirement 1.2**
     * WHEN the link is clicked, THE Affiliate_Link_Component SHALL open the Amazon URL 
     * in a new browser tab
     */
    it('should have target="_blank" attribute for valid Amazon product URLs', () => {
      fc.assert(
        fc.property(productUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Should have target="_blank" to open in new tab
          expect(anchor?.getAttribute('target')).toBe('_blank');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon URL, the anchor has target="_blank"
     * 
     * **Validates: Requirement 1.2**
     * Combined property test ensuring target="_blank" across all valid URL types
     */
    it('should have target="_blank" attribute for any valid Amazon URL', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Should have target="_blank" to open in new tab
          expect(anchor?.getAttribute('target')).toBe('_blank');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon short URL, the anchor has rel="noopener sponsored"
     * 
     * **Validates: Requirement 1.3**
     * THE Affiliate_Link_Component SHALL include `rel="noopener sponsored"` attributes 
     * on the anchor element
     */
    it('should have rel="noopener sponsored" attribute for valid Amazon short URLs', () => {
      fc.assert(
        fc.property(shortUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Should have rel="noopener sponsored" for security and FTC compliance
          expect(anchor?.getAttribute('rel')).toBe('noopener sponsored');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon product URL, the anchor has rel="noopener sponsored"
     * 
     * **Validates: Requirement 1.3**
     * THE Affiliate_Link_Component SHALL include `rel="noopener sponsored"` attributes 
     * on the anchor element
     */
    it('should have rel="noopener sponsored" attribute for valid Amazon product URLs', () => {
      fc.assert(
        fc.property(productUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Should have rel="noopener sponsored" for security and FTC compliance
          expect(anchor?.getAttribute('rel')).toBe('noopener sponsored');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon URL, the anchor has rel="noopener sponsored"
     * 
     * **Validates: Requirement 1.3**
     * Combined property test ensuring rel="noopener sponsored" across all valid URL types
     */
    it('should have rel="noopener sponsored" attribute for any valid Amazon URL', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Should have rel="noopener sponsored" for security and FTC compliance
          expect(anchor?.getAttribute('rel')).toBe('noopener sponsored');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon URL, the anchor has both target and rel attributes set correctly
     * 
     * **Validates: Requirements 1.2, 1.3**
     * Combined property test ensuring both attributes are present and correct
     */
    it('should have both target="_blank" and rel="noopener sponsored" for any valid Amazon URL', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Should have target="_blank" to open in new tab
          expect(anchor?.getAttribute('target')).toBe('_blank');
          
          // Should have rel="noopener sponsored" for security and FTC compliance
          expect(anchor?.getAttribute('rel')).toBe('noopener sponsored');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: The rel attribute should contain both "noopener" and "sponsored" values
     * 
     * **Validates: Requirement 1.3**
     * Ensures both security (noopener) and FTC compliance (sponsored) are present
     */
    it('should have rel attribute containing both "noopener" and "sponsored" values', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          const relValue = anchor?.getAttribute('rel') || '';
          
          // rel should contain "noopener" for security
          expect(relValue).toContain('noopener');
          
          // rel should contain "sponsored" for FTC compliance
          expect(relValue).toContain('sponsored');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Anchor attributes should be consistent across multiple renders
     * 
     * **Validates: Requirements 1.2, 1.3**
     * Ensures the component produces consistent output for the same input
     */
    it('should produce consistent anchor attributes across multiple renders', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container: container1 } = render(React.createElement(AffiliateLink, { url }));
          const { container: container2 } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor1 = container1.querySelector('a');
          const anchor2 = container2.querySelector('a');
          
          // Both renders should produce anchors with identical attributes
          expect(anchor1?.getAttribute('target')).toBe(anchor2?.getAttribute('target'));
          expect(anchor1?.getAttribute('rel')).toBe(anchor2?.getAttribute('rel'));
          expect(anchor1?.getAttribute('href')).toBe(anchor2?.getAttribute('href'));
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon URL, the anchor has an aria-label attribute
     * 
     * **Validates: Requirements 2.5, 6.1**
     * THE Affiliate_Link_Component SHALL include an `aria-label` attribute describing 
     * the affiliate nature of the link
     * THE Affiliate_Link_Component SHALL include appropriate ARIA attributes for screen readers
     */
    it('should have aria-label attribute for any valid Amazon URL', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Should have aria-label attribute
          const ariaLabel = anchor?.getAttribute('aria-label');
          expect(ariaLabel).not.toBeNull();
          expect(ariaLabel).toBeTruthy();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: The aria-label should indicate the link is an affiliate link
     * 
     * **Validates: Requirement 2.5**
     * THE Affiliate_Link_Component SHALL include an `aria-label` attribute describing 
     * the affiliate nature of the link
     */
    it('should have aria-label indicating affiliate nature', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          const ariaLabel = anchor?.getAttribute('aria-label') || '';
          
          // aria-label should contain "affiliate" to indicate affiliate nature
          expect(ariaLabel.toLowerCase()).toContain('affiliate');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: The aria-label should indicate the link opens in a new tab
     * 
     * **Validates: Requirement 6.4**
     * THE Affiliate_Link_Component SHALL indicate that the link opens in a new tab 
     * for screen reader users
     */
    it('should have aria-label indicating new tab behavior', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          const ariaLabel = anchor?.getAttribute('aria-label') || '';
          
          // aria-label should indicate new tab behavior
          expect(ariaLabel.toLowerCase()).toContain('new tab');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: The aria-label should include the product title
     * 
     * **Validates: Requirements 2.5, 6.1**
     * The aria-label should include the title for context
     */
    it('should have aria-label including the product title when provided', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, titleArbitrary, (url, title) => {
          const { container } = render(React.createElement(AffiliateLink, { url, title }));
          
          const anchor = container.querySelector('a');
          const ariaLabel = anchor?.getAttribute('aria-label') || '';
          
          // aria-label should include the provided title
          expect(ariaLabel).toContain(title);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: The aria-label should include default title when no title provided
     * 
     * **Validates: Requirements 2.5, 6.1**
     * The aria-label should include "View on Amazon" when no title is provided
     */
    it('should have aria-label including default title when no title provided', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          const ariaLabel = anchor?.getAttribute('aria-label') || '';
          
          // aria-label should include the default title
          expect(ariaLabel).toContain('View on Amazon');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: The aria-label should follow the expected format
     * 
     * **Validates: Requirements 2.5, 6.1, 6.4**
     * Format: "{title} (affiliate link, opens in new tab)"
     */
    it('should have aria-label in the expected format', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, titleArbitrary, (url, title) => {
          const { container } = render(React.createElement(AffiliateLink, { url, title }));
          
          const anchor = container.querySelector('a');
          const ariaLabel = anchor?.getAttribute('aria-label');
          
          // aria-label should match the expected format
          const expectedAriaLabel = `${title} (affiliate link, opens in new tab)`;
          expect(ariaLabel).toBe(expectedAriaLabel);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: affiliate-link-component, Property 3: Link Text Behavior
   * 
   * **Validates: Requirements 1.4, 1.5**
   * 
   * *For any* valid Amazon URL:
   * - If a non-empty title is provided, the link text SHALL equal the provided title
   * - If no title is provided (or title is empty/whitespace), the link text SHALL be "View on Amazon"
   */
  describe('Property 3: Link Text Behavior', () => {
    /**
     * Property: For any valid Amazon URL with a non-empty title, the link text equals the title
     * 
     * **Validates: Requirement 1.4**
     * WHEN a product title is provided, THE Affiliate_Link_Component SHALL display 
     * the title as the link text
     */
    it('should display the provided title as link text when title is non-empty', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, titleArbitrary, (url, title) => {
          const { container } = render(React.createElement(AffiliateLink, { url, title }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Link text should equal the provided title
          expect(anchor?.textContent).toBe(title);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon short URL with a non-empty title, the link text equals the title
     * 
     * **Validates: Requirement 1.4**
     * Specific test for short URLs with custom titles
     */
    it('should display the provided title as link text for short URLs', () => {
      fc.assert(
        fc.property(shortUrlArbitrary, titleArbitrary, (url, title) => {
          const { container } = render(React.createElement(AffiliateLink, { url, title }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Link text should equal the provided title
          expect(anchor?.textContent).toBe(title);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon product URL with a non-empty title, the link text equals the title
     * 
     * **Validates: Requirement 1.4**
     * Specific test for product URLs with custom titles
     */
    it('should display the provided title as link text for product URLs', () => {
      fc.assert(
        fc.property(productUrlArbitrary, titleArbitrary, (url, title) => {
          const { container } = render(React.createElement(AffiliateLink, { url, title }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Link text should equal the provided title
          expect(anchor?.textContent).toBe(title);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon URL without a title prop, the link text is "View on Amazon"
     * 
     * **Validates: Requirement 1.5**
     * WHEN no product title is provided, THE Affiliate_Link_Component SHALL display 
     * a default text of "View on Amazon"
     */
    it('should display "View on Amazon" when no title is provided', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Link text should be the default "View on Amazon"
          expect(anchor?.textContent).toBe('View on Amazon');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon short URL without a title, the link text is "View on Amazon"
     * 
     * **Validates: Requirement 1.5**
     * Specific test for short URLs without custom titles
     */
    it('should display "View on Amazon" for short URLs when no title is provided', () => {
      fc.assert(
        fc.property(shortUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Link text should be the default "View on Amazon"
          expect(anchor?.textContent).toBe('View on Amazon');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon product URL without a title, the link text is "View on Amazon"
     * 
     * **Validates: Requirement 1.5**
     * Specific test for product URLs without custom titles
     */
    it('should display "View on Amazon" for product URLs when no title is provided', () => {
      fc.assert(
        fc.property(productUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Link text should be the default "View on Amazon"
          expect(anchor?.textContent).toBe('View on Amazon');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any valid Amazon URL with undefined title, the link text is "View on Amazon"
     * 
     * **Validates: Requirement 1.5**
     * Ensures undefined title falls back to default
     */
    it('should display "View on Amazon" when title is undefined', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url, title: undefined }));
          
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Link text should be the default "View on Amazon"
          expect(anchor?.textContent).toBe('View on Amazon');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Link text should be preserved exactly as provided (no trimming or modification)
     * 
     * **Validates: Requirement 1.4**
     * Ensures the component doesn't modify the provided title
     */
    it('should preserve the title exactly as provided without modification', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, titleArbitrary, (url, title) => {
          const { container } = render(React.createElement(AffiliateLink, { url, title }));
          
          const anchor = container.querySelector('a');
          
          // Link text should be exactly the provided title (not trimmed or modified)
          expect(anchor?.textContent).toBe(title);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Link text behavior should be consistent across multiple renders
     * 
     * **Validates: Requirements 1.4, 1.5**
     * Ensures the component produces consistent link text for the same inputs
     */
    it('should produce consistent link text across multiple renders with title', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, titleArbitrary, (url, title) => {
          const { container: container1 } = render(React.createElement(AffiliateLink, { url, title }));
          const { container: container2 } = render(React.createElement(AffiliateLink, { url, title }));
          
          const anchor1 = container1.querySelector('a');
          const anchor2 = container2.querySelector('a');
          
          // Both renders should produce identical link text
          expect(anchor1?.textContent).toBe(anchor2?.textContent);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Link text behavior should be consistent across multiple renders without title
     * 
     * **Validates: Requirement 1.5**
     * Ensures the component produces consistent default link text
     */
    it('should produce consistent link text across multiple renders without title', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container: container1 } = render(React.createElement(AffiliateLink, { url }));
          const { container: container2 } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor1 = container1.querySelector('a');
          const anchor2 = container2.querySelector('a');
          
          // Both renders should produce identical link text
          expect(anchor1?.textContent).toBe(anchor2?.textContent);
          expect(anchor1?.textContent).toBe('View on Amazon');
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: affiliate-link-component, Property 5: Invalid URL Error Handling
   * 
   * **Validates: Requirements 3.3, 3.4, 3.5**
   * 
   * *For any* invalid URL (non-Amazon domain, malformed URL, or empty string), the component SHALL:
   * - Display an error message
   * - NOT render a clickable anchor element
   */
  describe('Property 5: Invalid URL Error Handling', () => {
    /**
     * Invalid URL generator (non-Amazon domains)
     * Generates URLs that are valid URLs but not Amazon domains
     */
    const nonAmazonUrlArbitrary = fc.webUrl().filter(url => {
      try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        // Filter out any URL that contains amazon or amzn
        return !hostname.includes('amazon') && !hostname.includes('amzn');
      } catch {
        return true; // Include malformed URLs
      }
    });

    /**
     * Malformed URL generator
     * Generates strings that are not valid URLs
     */
    const malformedUrlArbitrary = fc.oneof(
      fc.constant('not-a-url'),
      fc.constant('just some text'),
      fc.constant('http://'),
      fc.constant('https://'),
      fc.constant('://missing-protocol.com'),
      fc.constant('ftp://wrong-protocol.com/path'),
      fc.stringMatching(/^[a-z]{3,10}$/).filter(s => !s.includes('http')), // Random short strings
      fc.stringMatching(/^[a-zA-Z0-9]{5,20}$/) // Alphanumeric strings without protocol
    );

    /**
     * Empty/whitespace URL generator
     * Generates empty strings or strings with only whitespace
     */
    const emptyUrlArbitrary = fc.oneof(
      fc.constant(''),
      fc.constant('   '),
      fc.constant('\t'),
      fc.constant('\n'),
      fc.constant('  \t\n  ')
    );

    /**
     * Fake Amazon URL generator
     * Generates URLs that look like Amazon but aren't valid Amazon domains
     */
    const fakeAmazonUrlArbitrary = fc.oneof(
      fc.constant('https://fake-amazon.com/product'),
      fc.constant('https://amazon-fake.com/dp/B08N5WRWNW'),
      fc.constant('https://www.notamazon.com/dp/B08N5WRWNW'),
      fc.constant('https://amazonn.com/dp/B08N5WRWNW'),
      fc.constant('https://amazn.to/abc123'), // Note: amazn not amzn
      fc.constant('https://amzn.com/abc123'), // amzn.com is not valid, only amzn.to
      fc.constant('https://amazon.invalid/dp/B08N5WRWNW'),
      fc.constant('https://sub.amazon.fake.com/dp/B08N5WRWNW')
    );

    /**
     * Combined generator for any invalid URL
     */
    const invalidUrlArbitrary = fc.oneof(
      nonAmazonUrlArbitrary,
      malformedUrlArbitrary,
      emptyUrlArbitrary,
      fakeAmazonUrlArbitrary
    );

    /**
     * Property: For any non-Amazon URL, the component should NOT render an anchor element
     * 
     * **Validates: Requirement 3.5**
     * IF the URL validation fails, THEN THE Affiliate_Link_Component SHALL not render a clickable link
     */
    it('should NOT render an anchor element for non-Amazon URLs', () => {
      fc.assert(
        fc.property(nonAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Should NOT have any anchor elements
          const anchor = container.querySelector('a');
          expect(anchor).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any non-Amazon URL, the component should display an error message
     * 
     * **Validates: Requirement 3.3**
     * WHEN an invalid or non-Amazon URL is provided, THE Affiliate_Link_Component 
     * SHALL display an error message
     */
    it('should display an error message for non-Amazon URLs', () => {
      fc.assert(
        fc.property(nonAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Should have an element with role="alert" (error message)
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).not.toBeNull();
          
          // Error element should have text content
          expect(errorElement?.textContent).toBeTruthy();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any malformed URL, the component should NOT render an anchor element
     * 
     * **Validates: Requirement 3.5**
     * IF the URL validation fails, THEN THE Affiliate_Link_Component SHALL not render a clickable link
     */
    it('should NOT render an anchor element for malformed URLs', () => {
      fc.assert(
        fc.property(malformedUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Should NOT have any anchor elements
          const anchor = container.querySelector('a');
          expect(anchor).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any malformed URL, the component should display an error message
     * 
     * **Validates: Requirement 3.3**
     * WHEN an invalid or non-Amazon URL is provided, THE Affiliate_Link_Component 
     * SHALL display an error message
     */
    it('should display an error message for malformed URLs', () => {
      fc.assert(
        fc.property(malformedUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Should have an element with role="alert" (error message)
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).not.toBeNull();
          
          // Error element should have text content
          expect(errorElement?.textContent).toBeTruthy();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any empty/whitespace URL, the component should NOT render an anchor element
     * 
     * **Validates: Requirements 3.4, 3.5**
     * WHEN an empty URL is provided, THE Affiliate_Link_Component SHALL display an error message
     * IF the URL validation fails, THEN THE Affiliate_Link_Component SHALL not render a clickable link
     */
    it('should NOT render an anchor element for empty/whitespace URLs', () => {
      fc.assert(
        fc.property(emptyUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Should NOT have any anchor elements
          const anchor = container.querySelector('a');
          expect(anchor).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any empty/whitespace URL, the component should display an error message
     * 
     * **Validates: Requirement 3.4**
     * WHEN an empty URL is provided, THE Affiliate_Link_Component SHALL display an error message
     */
    it('should display an error message for empty/whitespace URLs', () => {
      fc.assert(
        fc.property(emptyUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Should have an element with role="alert" (error message)
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).not.toBeNull();
          
          // Error element should have text content
          expect(errorElement?.textContent).toBeTruthy();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any fake Amazon URL, the component should NOT render an anchor element
     * 
     * **Validates: Requirements 3.3, 3.5**
     * WHEN an invalid or non-Amazon URL is provided, THE Affiliate_Link_Component 
     * SHALL display an error message
     * IF the URL validation fails, THEN THE Affiliate_Link_Component SHALL not render a clickable link
     */
    it('should NOT render an anchor element for fake Amazon URLs', () => {
      fc.assert(
        fc.property(fakeAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Should NOT have any anchor elements
          const anchor = container.querySelector('a');
          expect(anchor).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any fake Amazon URL, the component should display an error message
     * 
     * **Validates: Requirement 3.3**
     * WHEN an invalid or non-Amazon URL is provided, THE Affiliate_Link_Component 
     * SHALL display an error message
     */
    it('should display an error message for fake Amazon URLs', () => {
      fc.assert(
        fc.property(fakeAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Should have an element with role="alert" (error message)
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).not.toBeNull();
          
          // Error element should have text content
          expect(errorElement?.textContent).toBeTruthy();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any invalid URL, the component should NOT render an anchor element
     * 
     * **Validates: Requirements 3.3, 3.4, 3.5**
     * Combined property test ensuring no anchor is rendered for any invalid URL type
     */
    it('should NOT render an anchor element for any invalid URL', () => {
      fc.assert(
        fc.property(invalidUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Should NOT have any anchor elements
          const anchor = container.querySelector('a');
          expect(anchor).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: For any invalid URL, the component should display an error message
     * 
     * **Validates: Requirements 3.3, 3.4**
     * Combined property test ensuring error message is displayed for any invalid URL type
     */
    it('should display an error message for any invalid URL', () => {
      fc.assert(
        fc.property(invalidUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Should have an element with role="alert" (error message)
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).not.toBeNull();
          
          // Error element should have text content
          expect(errorElement?.textContent).toBeTruthy();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: parseAmazonUrl should return error for any invalid URL
     * 
     * **Validates: Requirements 3.3, 3.4**
     * Ensures the validation function correctly identifies invalid URLs
     */
    it('should return error from parseAmazonUrl for any invalid URL', () => {
      fc.assert(
        fc.property(invalidUrlArbitrary, (url) => {
          const result = parseAmazonUrl(url);
          
          // URL should be null for invalid URLs
          expect(result.url).toBeNull();
          
          // Error should be set for invalid URLs
          expect(result.error).not.toBeNull();
          expect(typeof result.error).toBe('string');
          expect(result.error!.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: parseAmazonUrl should have mutually exclusive url and error for invalid URLs
     * 
     * **Validates: Requirements 3.3, 3.4, 3.5**
     * Ensures the return type invariant: either url is set and error is null,
     * or url is null and error is set
     */
    it('should have mutually exclusive url and error for invalid URLs', () => {
      fc.assert(
        fc.property(invalidUrlArbitrary, (url) => {
          const result = parseAmazonUrl(url);
          
          // For invalid URLs: url should be null, error should be set
          expect(result.url).toBeNull();
          expect(result.error).not.toBeNull();
          
          // They should be mutually exclusive
          const hasUrl = result.url !== null;
          const hasError = result.error !== null;
          expect(hasUrl).not.toBe(hasError);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Error handling should be consistent across multiple renders
     * 
     * **Validates: Requirements 3.3, 3.4, 3.5**
     * Ensures the component produces consistent error output for the same invalid input
     */
    it('should produce consistent error handling across multiple renders', () => {
      fc.assert(
        fc.property(invalidUrlArbitrary, (url) => {
          const { container: container1 } = render(React.createElement(AffiliateLink, { url }));
          const { container: container2 } = render(React.createElement(AffiliateLink, { url }));
          
          // Both renders should NOT have anchor elements
          const anchor1 = container1.querySelector('a');
          const anchor2 = container2.querySelector('a');
          expect(anchor1).toBeNull();
          expect(anchor2).toBeNull();
          
          // Both renders should have error elements
          const error1 = container1.querySelector('[role="alert"]');
          const error2 = container2.querySelector('[role="alert"]');
          expect(error1).not.toBeNull();
          expect(error2).not.toBeNull();
          
          // Error messages should be identical
          expect(error1?.textContent).toBe(error2?.textContent);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Error message should contain meaningful text
     * 
     * **Validates: Requirements 3.3, 3.4**
     * Ensures error messages are user-friendly and informative
     */
    it('should display meaningful error messages for invalid URLs', () => {
      fc.assert(
        fc.property(invalidUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          const errorElement = container.querySelector('[role="alert"]');
          const errorText = errorElement?.textContent || '';
          
          // Error message should be non-empty
          expect(errorText.length).toBeGreaterThan(0);
          
          // Error message should contain recognizable error-related words
          // (checking for common error message patterns)
          const hasErrorIndicator = 
            errorText.includes('⚠️') || // Warning emoji
            errorText.toLowerCase().includes('invalid') ||
            errorText.toLowerCase().includes('error') ||
            errorText.toLowerCase().includes('not') ||
            errorText.toLowerCase().includes('no ') ||
            errorText.toLowerCase().includes('url');
          
          expect(hasErrorIndicator).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: affiliate-link-component, Property 4: Affiliate Indicator Visibility
   * 
   * **Validates: Requirements 2.1, 2.4, 4.4**
   * 
   * *For any* valid Amazon URL, the component SHALL render a visible affiliate indicator 
   * that is present in the DOM without requiring user interaction.
   * 
   * The visual indicator is the distinct orange color styling of the link text,
   * which differentiates affiliate links from regular links.
   * 
   * Requirements:
   * - 2.1: Display a visual indicator that the link is an affiliate link
   * - 2.4: Disclosure indicator SHALL be visible without requiring user interaction
   * - 4.4: Display an icon indicating it is an external/affiliate link
   */
  describe('Property 4: Affiliate Indicator Visibility', () => {
    /**
     * Property: For any valid Amazon URL, the component renders a styled affiliate link
     * 
     * **Validates: Requirements 2.1, 2.4, 4.4**
     * THE Affiliate_Link_Component SHALL display a visual indicator that the link is an affiliate link
     * The visual indicator is the distinct CSS class applied to the link
     */
    it('should render a styled affiliate link for any valid Amazon URL', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // The affiliate link should have a CSS class applied for styling
          const anchor = container.querySelector('a');
          
          expect(anchor).not.toBeNull();
          // The anchor should have a class attribute (CSS module class)
          expect(anchor?.className).toBeTruthy();
          expect(anchor?.className.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: The affiliate link should be visible without user interaction
     * 
     * **Validates: Requirement 2.4**
     * THE disclosure indicator SHALL be visible without requiring user interaction
     * The link with its distinct styling is visible immediately upon render
     */
    it('should have affiliate link visible in DOM without user interaction', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // The link should be present immediately in the DOM
          const anchor = container.querySelector('a');
          
          // Anchor should exist
          expect(anchor).not.toBeNull();
          
          // Anchor should have visible text content
          expect(anchor?.textContent).toBeTruthy();
          expect(anchor?.textContent?.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: The affiliate link should be wrapped in a container for tooltip positioning
     * 
     * **Validates: Requirements 2.1, 4.4**
     * Ensures the link is properly wrapped for tooltip functionality
     */
    it('should render affiliate link within a wrapper element', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Find the wrapper element that contains the anchor
          const wrapper = container.firstElementChild;
          
          // Wrapper should exist
          expect(wrapper).not.toBeNull();
          
          // Wrapper should contain the anchor
          const anchor = wrapper?.querySelector('a');
          expect(anchor).not.toBeNull();
          
          // Anchor should be a child of the wrapper
          expect(anchor?.parentElement).toBe(wrapper);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: The affiliate link styling should be consistent across renders
     * 
     * **Validates: Requirements 2.1, 2.4, 4.4**
     * Ensures the link is rendered consistently for the same URL
     */
    it('should render consistent affiliate link styling across multiple renders', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container: container1 } = render(React.createElement(AffiliateLink, { url }));
          const { container: container2 } = render(React.createElement(AffiliateLink, { url }));
          
          const anchor1 = container1.querySelector('a');
          const anchor2 = container2.querySelector('a');
          
          // Both renders should have anchors
          expect(anchor1).not.toBeNull();
          expect(anchor2).not.toBeNull();
          
          // Anchors should have identical class names (same styling)
          expect(anchor1?.className).toBe(anchor2?.className);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: The affiliate link should be styled regardless of title prop
     * 
     * **Validates: Requirements 2.1, 2.4, 4.4**
     * Ensures the styling is always present whether or not a custom title is provided
     */
    it('should render styled affiliate link regardless of title prop', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, titleArbitrary, (url, title) => {
          // Test with custom title
          const { container: containerWithTitle } = render(
            React.createElement(AffiliateLink, { url, title })
          );
          
          // Test without title (default)
          const { container: containerWithoutTitle } = render(
            React.createElement(AffiliateLink, { url })
          );
          
          // Both should have styled anchor elements
          const anchorWithTitle = containerWithTitle.querySelector('a');
          const anchorWithoutTitle = containerWithoutTitle.querySelector('a');
          
          expect(anchorWithTitle).not.toBeNull();
          expect(anchorWithoutTitle).not.toBeNull();
          
          // Both should have the same CSS class (same styling)
          expect(anchorWithTitle?.className).toBe(anchorWithoutTitle?.className);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Exactly one affiliate link should be rendered per component
     * 
     * **Validates: Requirements 2.1, 4.4**
     * Ensures the component doesn't render multiple links
     */
    it('should render exactly one affiliate link per component', () => {
      fc.assert(
        fc.property(validAmazonUrlArbitrary, (url) => {
          const { container } = render(React.createElement(AffiliateLink, { url }));
          
          // Find all anchor elements
          const anchors = container.querySelectorAll('a');
          
          // Should have exactly one anchor
          expect(anchors.length).toBe(1);
        }),
        { numRuns: 100 }
      );
    });
  });
});
