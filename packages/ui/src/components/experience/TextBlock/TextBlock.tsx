// src/components/experience/TextBlock/TextBlock.tsx
import React from 'react';
import styles from './TextBlock.module.css';

export interface TextBlockProps {
  content: string;
  variant?: 'default' | 'quote';
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  content,
  variant = 'default',
  align = 'left',
  className,
  style,
}) => {
  return (
    <div
      className={`${styles.textBlock} ${styles[variant]} ${styles[align]} ${className ?? ''}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default TextBlock;
