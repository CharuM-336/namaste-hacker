// src/components/book-experience/CharacterCard/CharacterCard.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "../../../design-system/primitives/Box";
import { colors, spacing, radius, typography, shadows } from "../../../design-system/tokens";
import styles from "./CharacterCard.module.css";

export interface CharacterCardProps {
  avatarUrl?: string;
  name: string;
  role?: string;
  biography?: string;
  personality?: string;
  tags?: string[];
  stats?: Record<string, string | number>;
  metadata?: Record<string, unknown>;
  variant?: "default" | "compact";
  loading?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CharacterCard = forwardRef<HTMLDivElement, CharacterCardProps>(
  (
    {
      avatarUrl,
      name,
      role,
      biography,
      personality,
      tags = [],
      stats = {},
      metadata,
      variant = "default",
      loading = false,
      error = false,
      className,
      style,
    },
    ref,
  ) => {
    if (loading) {
      return <div className={styles.loading}>Loading…</div>;
    }
    if (error) {
      return <div className={styles.error}>Failed to load character.</div>;
    }
    return (
      <Box
        ref={ref}
        className={`${styles.characterCard} ${styles[variant]} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          boxShadow: shadows.sm,
        }}
        role="region"
        aria-label={`Character Card: ${name}`}
      >
        {avatarUrl && (
          <img src={avatarUrl} alt={`Avatar of ${name}`} className={styles.avatar} />
        )}
        <h3 className={styles.name}>{name}</h3>
        {role && <p className={styles.role}>{role}</p>}
        {biography && <p className={styles.biography}>{biography}</p>}
        {personality && <p className={styles.personality}>{personality}</p>}
        {tags.length > 0 && (
          <ul className={styles.tags}>
            {tags.map((t, i) => (
              <li key={i} className={styles.tag}>
                {t}
              </li>
            ))}
          </ul>
        )}
        {Object.keys(stats).length > 0 && (
          <dl className={styles.stats}>
            {Object.entries(stats).map(([k, v]) => (
              <React.Fragment key={k}>
                <dt className={styles.statKey}>{k}</dt>
                <dd className={styles.statValue}>{v}</dd>
              </React.Fragment>
            ))}
          </dl>
        )}
      </Box>
    );
  },
);

export default memo(CharacterCard);
