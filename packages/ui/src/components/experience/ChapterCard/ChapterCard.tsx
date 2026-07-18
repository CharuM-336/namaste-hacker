// src/components/experience/ChapterCard/ChapterCard.tsx
import * as React from 'react';
import styles from './ChapterCard.module.css';

export interface ChapterCardProps {
  title: string;
  chapterNumber: number;
  summary?: string;
  onClick?: () => void;
  variant?: 'default' | 'selected';
  className?: string;
  style?: React.CSSProperties;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  title,
  chapterNumber,
  summary,
  onClick,
  variant = 'default',
  className,
  style,
}) => {
  return (
    <div
      className={`${styles.card} ${styles[variant]} ${className ?? ''}`}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          onClick();
        }
      }}
    >
      <h2 className={styles.title}>Chapter {chapterNumber}: {title}</h2>
      {summary && <p className={styles.summary}>{summary}</p>}
    </div>
  );
};

export default ChapterCard;
