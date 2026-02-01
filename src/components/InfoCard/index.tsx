import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface InfoCardProps {
  difficulty?: 1 | 2 | 3 | 4 | 5;
  time?: number; // in minutes
  videoUrl?: string;
}

export interface DifficultyIndicatorProps {
  level: number;
}

/**
 * Formats time in minutes to human-readable string
 * e.g., 90 -> "1h 30m", 45 -> "45m", 120 -> "2h"
 * 
 * @param minutes - The time in minutes to format
 * @returns A human-readable string representation of the time
 */
export function formatTime(minutes: number): string {
  // Handle invalid inputs
  if (typeof minutes !== 'number' || !Number.isFinite(minutes)) {
    return '0m';
  }

  // Handle negative or zero values
  if (minutes <= 0) {
    return '0m';
  }

  // Round to nearest integer
  const roundedMinutes = Math.round(minutes);

  const hours = Math.floor(roundedMinutes / 60);
  const remainingMinutes = roundedMinutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Renders difficulty as visual indicators (filled/empty circles)
 * Always renders 5 indicators, with `level` of them filled
 * 
 * @param level - The difficulty level (1-5)
 */
export function DifficultyIndicator({ level }: DifficultyIndicatorProps): ReactNode {
  // Clamp level to valid range (1-5)
  const clampedLevel = Math.max(1, Math.min(5, Math.round(level)));

  const indicators: ReactNode[] = [];
  
  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= clampedLevel;
    indicators.push(
      <span
        key={i}
        className={`${styles.difficultyDot} ${isFilled ? styles.filled : styles.empty}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div 
      className={styles.difficultyContainer}
      role="img"
      aria-label={`Difficulty: ${clampedLevel} out of 5`}
    >
      <span className={styles.difficultyLabel}>Difficulty:</span>
      <div className={styles.difficultyDots}>
        {indicators}
      </div>
    </div>
  );
}

/**
 * InfoCard component displays tutorial metadata at the top of blog posts
 * Shows difficulty level, estimated time, and video link
 * 
 * Returns null if no props are provided (graceful handling)
 * 
 * @param difficulty - Difficulty level on a 1-5 scale
 * @param time - Estimated time in minutes
 * @param videoUrl - URL to the associated YouTube video
 */
export default function InfoCard({ 
  difficulty, 
  time, 
  videoUrl 
}: InfoCardProps): ReactNode {
  // Return null if no props provided (graceful handling)
  if (!difficulty && !time && !videoUrl) {
    return null;
  }

  // Validate difficulty is in valid range if provided
  const validDifficulty = difficulty !== undefined && 
    difficulty >= 1 && 
    difficulty <= 5;

  // Validate time is a positive number if provided
  const validTime = time !== undefined && 
    typeof time === 'number' && 
    time > 0;

  // Validate videoUrl is a non-empty string if provided
  const validVideoUrl = videoUrl !== undefined && 
    typeof videoUrl === 'string' && 
    videoUrl.trim().length > 0;

  // If all provided values are invalid, return null
  if (!validDifficulty && !validTime && !validVideoUrl) {
    return null;
  }

  return (
    <div className={styles.infoCard}>
      {validDifficulty && (
        <DifficultyIndicator level={difficulty} />
      )}
      
      {validTime && (
        <div className={styles.timeContainer}>
          <span className={styles.timeIcon}>⏱️</span>
          <span className={styles.timeValue}>{formatTime(time)}</span>
        </div>
      )}
      
      {validVideoUrl && (
        <a 
          href={videoUrl.trim()} 
          className={styles.videoLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.videoIcon}>▶️</span>
          <span>Watch Video</span>
        </a>
      )}
    </div>
  );
}
