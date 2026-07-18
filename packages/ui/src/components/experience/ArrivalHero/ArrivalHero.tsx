// src/components/experience/ArrivalHero/ArrivalHero.tsx
import React from 'react';
import styles from './ArrivalHero.module.css';

export interface ArrivalHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  variant?: 'default' | 'compact';
  className?: string;
  style?: React.CSSProperties;
}

export const ArrivalHero: React.FC<ArrivalHeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  variant = 'default',
  className,
  style,
}) => {
  const containerStyle: React.CSSProperties = {
    ...(backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}),
    ...style,
  };

  return (
    <section
      className={`${styles.container} ${styles[variant]} ${className ?? ''}`}
      style={containerStyle}
    >
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </section>
  );
};

export default ArrivalHero;
