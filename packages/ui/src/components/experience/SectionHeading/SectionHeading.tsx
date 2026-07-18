// src/components/experience/SectionHeading/SectionHeading.tsx
import React from 'react';
import styles from './SectionHeading.module.css';

export interface SectionHeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  variant?: 'default' | 'accent';
  className?: string;
  style?: React.CSSProperties;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  level = 1,
  children,
  variant = 'default',
  className,
  style,
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Tag
      className={`${styles.heading} ${styles[variant]} ${className ?? ''}`}
      style={style}
    >
      {children}
    </Tag>
  );
};

export default SectionHeading;
