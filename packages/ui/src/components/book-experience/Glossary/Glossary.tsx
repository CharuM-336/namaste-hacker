// src/components/book-experience/Glossary/Glossary.tsx
import React, { forwardRef, memo, useState } from "react";
import { Box } from "../../../design-system/primitives/Box";
import { colors, spacing, radius, typography, shadows } from "../../../design-system/tokens";
import styles from "./Glossary.module.css";

export interface GlossaryTerm {
  term: string;
  definition: string;
  category?: string;
}

export interface GlossaryProps {
  terms: GlossaryTerm[];
  searchable?: boolean;
  variant?: "default" | "compact";
  loading?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Glossary = forwardRef<HTMLDivElement, GlossaryProps>(
  (
    { terms, searchable = false, variant = "default", loading = false, error = false, className, style },
    ref,
  ) => {
    const [filter, setFilter] = useState("");
    const visibleTerms = searchable && filter
      ? terms.filter((t) => t.term.toLowerCase().includes(filter.toLowerCase()))
      : terms;
    if (loading) {
      return <div className={styles.loading}>Loading…</div>;
    }
    if (error) {
      return <div className={styles.error}>Failed to load glossary.</div>;
    }
    return (
      <Box
        ref={ref}
        className={`${styles.glossary} ${styles[variant]} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          boxShadow: shadows.sm,
        }}
        role="region"
        aria-label="Glossary"
      >
        {searchable && (
          <input
            type="text"
            placeholder="Search terms..."
            className={styles.search}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        )}
        <dl className={styles.list}>
          {visibleTerms.map((t, i) => (
            <React.Fragment key={i}>
              <dt className={styles.term}>{t.term}</dt>
              <dd className={styles.definition}>{t.definition}</dd>
            </React.Fragment>
          ))}
        </dl>
      </Box>
    );
  },
);

export default memo(Glossary);
