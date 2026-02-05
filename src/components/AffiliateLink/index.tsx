import type { ReactNode } from 'react';
import styles from './styles.module.css';

/**
 * Props for the AffiliateLink component
 */
export interface AffiliateLinkProps {
  /** Amazon URL (short URL like amzn.to/xxx or full product URL) */
  url: string;
  /** Optional product title to display as link text */
  title?: string;
}

/**
 * Result of parsing and validating an Amazon URL
 */
export interface ParsedAmazonUrl {
  /** The validated URL, null if invalid */
  url: string | null;
  /** Error message if validation failed, null if valid */
  error: string | null;
}

/**
 * Supported Amazon TLDs for regional sites
 */
const AMAZON_TLDS = [
  'com', 'co.uk', 'de', 'fr', 'it', 'es', 'ca', 'com.au',
  'co.jp', 'in', 'com.br', 'com.mx', 'nl', 'sg', 'ae', 'sa'
];

/**
 * Checks if a hostname is a valid Amazon domain
 * Supports:
 * - amzn.to (short URLs)
 * - amazon.{tld}, www.amazon.{tld}, smile.amazon.{tld}
 * 
 * @param hostname - The hostname to validate
 * @returns true if the hostname is a valid Amazon domain
 */
function isValidAmazonHostname(hostname: string): boolean {
  const lowerHostname = hostname.toLowerCase();

  // Check for amzn.to short URL domain
  if (lowerHostname === 'amzn.to') {
    return true;
  }

  // Check for amazon.{tld} domains (with optional www. or smile. prefix)
  for (const tld of AMAZON_TLDS) {
    const baseDomain = `amazon.${tld}`;
    if (
      lowerHostname === baseDomain ||
      lowerHostname === `www.${baseDomain}` ||
      lowerHostname === `smile.${baseDomain}`
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Parses and validates an Amazon URL
 * Supports formats:
 * - https://amzn.to/xxxxx (short URLs)
 * - https://www.amazon.com/dp/ASIN
 * - https://amazon.co.uk/product/...
 * - https://smile.amazon.com/...
 * - http:// variants of all above
 * 
 * @param url - The Amazon URL to parse and validate
 * @returns ParsedAmazonUrl object with url or error
 */
export function parseAmazonUrl(url: string): ParsedAmazonUrl {
  // Handle empty or non-string input
  if (!url || typeof url !== 'string') {
    return { url: null, error: 'No Amazon URL provided' };
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return { url: null, error: 'No Amazon URL provided' };
  }

  // Try to parse as URL
  let urlObj: URL;
  try {
    urlObj = new URL(trimmedUrl);
  } catch {
    return { url: null, error: 'Invalid URL format' };
  }

  // Validate protocol (must be http or https)
  if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
    return { url: null, error: 'Invalid URL format' };
  }

  // Check if it's a valid Amazon domain
  if (!isValidAmazonHostname(urlObj.hostname)) {
    return { url: null, error: 'URL is not an Amazon link' };
  }

  // URL is valid - return the original URL unchanged
  return { url: trimmedUrl, error: null };
}

/**
 * FTC disclosure text for Amazon Associates
 * This is the standard Amazon Associates disclosure that meets FTC requirements
 */
const DISCLOSURE_TEXT = 'As an Amazon Associate, I earn from qualifying purchases.';

/**
 * Error display component for invalid Amazon URLs
 * Follows the YouTube component error pattern for consistency
 * Uses role="alert" for accessibility (screen readers announce immediately)
 */
function AffiliateLinkError({ message }: { message: string }): ReactNode {
  return (
    <span className={styles.affiliateLinkError} role="alert">
      <span className={styles.errorIcon}>⚠️</span>
      <span>{message}</span>
    </span>
  );
}

/**
 * Disclosure tooltip component that displays FTC disclosure text
 * Appears on hover and is accessible via keyboard focus
 */
function DisclosureTooltip(): ReactNode {
  return (
    <span className={styles.tooltip} role="tooltip">
      {DISCLOSURE_TEXT}
    </span>
  );
}

/**
 * Amazon Affiliate Link component that renders a styled affiliate link
 * with proper FTC disclosure and accessibility attributes
 * 
 * The link is styled in orange to visually distinguish it as an Amazon affiliate link.
 * 
 * @param url - The Amazon URL (supports amzn.to, amazon.com, amazon.co.uk, etc.)
 * @param title - Optional product title to display as link text
 */
export default function AffiliateLink({
  url,
  title = 'View on Amazon'
}: AffiliateLinkProps): ReactNode {
  const { url: validatedUrl, error } = parseAmazonUrl(url);

  if (error || !validatedUrl) {
    return <AffiliateLinkError message={error || 'Invalid Amazon URL'} />;
  }

  // Build aria-label that describes:
  // 1. The product title
  // 2. That it's an affiliate link
  // 3. That it opens in a new tab
  const ariaLabel = `${title} (affiliate link, opens in new tab)`;

  return (
    <span className={styles.affiliateLinkWrapper}>
      <a
        href={validatedUrl}
        target="_blank"
        rel="noopener sponsored"
        className={styles.affiliateLink}
        aria-label={ariaLabel}
      >
        {title}
      </a>
      <DisclosureTooltip />
    </span>
  );
}
