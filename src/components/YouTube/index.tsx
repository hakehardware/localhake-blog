import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface YouTubeProps {
  url: string;
  title?: string;
}

export interface ParsedVideoId {
  videoId: string | null;
  error: string | null;
}

/**
 * Parses YouTube URL and extracts video ID
 * Supports formats:
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - http:// variants of all above
 * 
 * @param url - The YouTube URL to parse
 * @returns ParsedVideoId object with videoId or error
 */
export function parseYouTubeUrl(url: string): ParsedVideoId {
  // Handle empty or non-string input
  if (!url || typeof url !== 'string') {
    return { videoId: null, error: 'No video URL provided' };
  }

  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return { videoId: null, error: 'No video URL provided' };
  }

  try {
    // Try to parse as URL
    let urlObj: URL;
    try {
      urlObj = new URL(trimmedUrl);
    } catch {
      return { videoId: null, error: 'Invalid URL format' };
    }

    const hostname = urlObj.hostname.toLowerCase();
    
    // Check if it's a YouTube domain
    const isYouTube = 
      hostname === 'youtu.be' ||
      hostname === 'youtube.com' ||
      hostname === 'www.youtube.com' ||
      hostname === 'm.youtube.com';

    if (!isYouTube) {
      return { videoId: null, error: 'URL is not a YouTube link' };
    }

    let videoId: string | null = null;

    // Handle youtu.be short URLs
    if (hostname === 'youtu.be') {
      // Video ID is the pathname without leading slash
      videoId = urlObj.pathname.slice(1).split('/')[0];
    }
    // Handle youtube.com/watch?v=VIDEO_ID
    else if (urlObj.pathname === '/watch') {
      videoId = urlObj.searchParams.get('v');
    }
    // Handle youtube.com/embed/VIDEO_ID
    else if (urlObj.pathname.startsWith('/embed/')) {
      videoId = urlObj.pathname.slice(7).split('/')[0];
    }
    // Handle youtube.com/v/VIDEO_ID (legacy format)
    else if (urlObj.pathname.startsWith('/v/')) {
      videoId = urlObj.pathname.slice(3).split('/')[0];
    }

    // Validate video ID format (YouTube video IDs are 11 characters)
    if (!videoId) {
      return { videoId: null, error: 'Could not extract video ID from URL' };
    }

    // Remove any query parameters that might have been included
    videoId = videoId.split('?')[0];

    // Basic validation: YouTube video IDs are typically 11 characters
    // and contain only alphanumeric characters, hyphens, and underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(videoId)) {
      return { videoId: null, error: 'Invalid video ID format' };
    }

    return { videoId, error: null };
  } catch {
    return { videoId: null, error: 'Failed to parse YouTube URL' };
  }
}

/**
 * Error display component for invalid YouTube URLs
 */
function YouTubeError({ message }: { message: string }): ReactNode {
  return (
    <div className={styles.youtubeError} role="alert">
      <span className={styles.errorIcon}>⚠️</span>
      <span>{message}</span>
    </div>
  );
}

/**
 * YouTube embed component that renders a responsive, privacy-enhanced video player
 * 
 * @param url - The YouTube video URL (supports youtu.be, youtube.com/watch, youtube.com/embed)
 * @param title - Optional title for the iframe (accessibility)
 */
export default function YouTube({ 
  url, 
  title = 'YouTube video' 
}: YouTubeProps): ReactNode {
  const { videoId, error } = parseYouTubeUrl(url);

  if (error || !videoId) {
    return <YouTubeError message={error || 'Invalid YouTube URL'} />;
  }

  return (
    <div className={styles.youtubeContainer}>
      <iframe
        className={styles.youtubeIframe}
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
