import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '../index';

describe('Homepage', () => {
  /**
   * Validates: Requirement 3.1
   * WHEN viewing the hero section, THE Homepage SHALL display a terminal-style prompt character (`>`) before the main title
   */
  it('renders terminal prompt before title', () => {
    render(<Home />);
    expect(screen.getByText('>')).toBeInTheDocument();
  });

  /**
   * Validates: Requirement 1.1
   * WHEN the site loads, THE Site_Config SHALL display "Localhake" as the site title
   */
  it('renders Localhake title', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /localhake/i })).toBeInTheDocument();
  });

  /**
   * Validates: Requirement 4.1
   * THE Homepage SHALL include an "About" section explaining the site's purpose
   */
  it('renders About section with tag', () => {
    render(<Home />);
    expect(screen.getByText('[ABOUT]')).toBeInTheDocument();
  });

  /**
   * Validates: Requirement 4.2
   * THE Homepage SHALL include a "Content" section highlighting the Blog and Wiki areas
   */
  it('renders Content section with tag', () => {
    render(<Home />);
    expect(screen.getByText('[CONTENT]')).toBeInTheDocument();
  });

  /**
   * Validates: Requirement 5.1, 5.3
   * THE Homepage SHALL display a prominent link to the YouTube channel
   * WHEN displaying social links, THE Homepage SHALL use terminal-style formatting
   */
  it('renders Connect section with tag', () => {
    render(<Home />);
    expect(screen.getByText('[CONNECT]')).toBeInTheDocument();
  });

  /**
   * Validates: Requirement 5.1
   * THE Homepage SHALL display a prominent link to the YouTube channel (https://www.youtube.com/@hakehardware)
   */
  it('renders YouTube social link with correct href', () => {
    render(<Home />);
    const youtubeLink = screen.getByRole('link', { name: /youtube/i });
    expect(youtubeLink).toHaveAttribute('href', 'https://www.youtube.com/@hakehardware');
  });

  /**
   * Validates: Requirement 6.2
   * THE Homepage SHALL include a reference or link to the main Localhake site in an appropriate location
   */
  it('renders main site link with correct href', () => {
    render(<Home />);
    const mainSiteLink = screen.getByRole('link', { name: /main site/i });
    expect(mainSiteLink).toHaveAttribute('href', 'https://localhake.com');
  });
});
