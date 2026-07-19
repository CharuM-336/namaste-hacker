// src/components/book-experience/LocationCard/LocationCard.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "../../../design-system/primitives/Box";
import {
  colors,
  spacing,
  radius,
  typography,
  shadows,
} from "../../../design-system/tokens";
import styles from "./LocationCard.module.css";

export interface LocationCardProps {
  imageUrl?: string;
  title: string;
  description?: string;
  significance?: string;
  chapterRefs?: string[]; // chapter ids
  relatedCharacters?: string[]; // character ids
  metadata?: Record<string, unknown>;
  variant?: "default" | "compact";
  loading?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const LocationCard = forwardRef<HTMLDivElement, LocationCardProps>(
  (
    {
      imageUrl,
      title,
      description,
      significance,
      chapterRefs = [],
      relatedCharacters = [],
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
      return <div className={styles.error}>Failed to load location.</div>;
    }
    return (
      <Box
        ref={ref}
        className={`${styles.locationCard} ${styles[variant]} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          boxShadow: shadows.sm,
        }}
        role="region"
        aria-label={`Location: ${title}`}
      >
        {imageUrl && (
          <img src={imageUrl} alt={title} className={styles.image} />
        )}
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {significance && <p className={styles.significance}>{significance}</p>}
        {chapterRefs.length > 0 && (
          <div className={styles.chapters}>
            <strong>Chapters:</strong>
            <ul>
              {chapterRefs.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
        {relatedCharacters.length > 0 && (
          <div className={styles.characters}>
            <strong>Characters:</strong>
            <ul>
              {relatedCharacters.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </Box>
    );
  },
);

export default memo(LocationCard);
