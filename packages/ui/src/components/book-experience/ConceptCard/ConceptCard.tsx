// src/components/book-experience/ConceptCard/ConceptCard.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "../../../design-system/primitives/Box";
import {
  colors,
  spacing,
  radius,
  typography,
  shadows,
} from "../../../design-system/tokens";
import styles from "./ConceptCard.module.css";

export interface ConceptCardProps {
  title: string;
  explanation: string;
  examples?: string[];
  relatedConcepts?: string[]; // IDs or titles
  difficulty?: "easy" | "medium" | "hard";
  importance?: number; // 0-100
  variant?: "default" | "compact";
  loading?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ConceptCard = forwardRef<HTMLDivElement, ConceptCardProps>(
  (
    {
      title,
      explanation,
      examples = [],
      relatedConcepts = [],
      difficulty,
      importance,
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
      return <div className={styles.error}>Failed to load concept.</div>;
    }
    return (
      <Box
        ref={ref}
        className={`${styles.conceptCard} ${styles[variant]} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          boxShadow: shadows.sm,
        }}
        role="region"
        aria-label={`Concept: ${title}`}
      >
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.explanation}>{explanation}</p>
        {difficulty && (
          <p className={styles.difficulty}>Difficulty: {difficulty}</p>
        )}
        {importance !== undefined && (
          <p className={styles.importance}>Importance: {importance}</p>
        )}
        {examples.length > 0 && (
          <div className={styles.examples}>
            <strong>Examples:</strong>
            <ul>
              {examples.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </div>
        )}
        {relatedConcepts.length > 0 && (
          <div className={styles.related}>
            <strong>Related:</strong>
            <ul>
              {relatedConcepts.map((rc, i) => (
                <li key={i}>{rc}</li>
              ))}
            </ul>
          </div>
        )}
      </Box>
    );
  },
);

export default memo(ConceptCard);
