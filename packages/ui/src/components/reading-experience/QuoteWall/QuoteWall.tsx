// src/components/reading-experience/QuoteWall/QuoteWall.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "../../../design-system/primitives/Box"; // Box primitive
import { colors, spacing, radius, shadows } from "../../../design-system/tokens";
import styles from "./QuoteWall.module.css";

export interface Quote {
  text: string;
  author?: string;
  source?: string;
  highlighted?: boolean;
}

export interface QuoteWallProps {
  quotes: Quote[];
  alignment?: "left" | "center" | "right";
  variant?: "default" | "decorative";
  className?: string;
  style?: React.CSSProperties;
}

const QuoteWall = forwardRef<HTMLDivElement, QuoteWallProps>(
  ({ quotes, alignment = "center", variant = "default", className, style }, ref) => {
    if (!quotes || quotes.length === 0) {
      return null; // empty state handled by renderer
    }
    const alignStyle: React.CSSProperties = {
      textAlign: alignment,
    };
    return (
      <Box
        ref={ref}
        className={`${styles.quoteWall} ${styles[variant]} ${className ?? ""}`}
        style={{ ...style, ...alignStyle, backgroundColor: colors.background, borderRadius: radius.md, boxShadow: shadows.sm, padding: spacing.md }}
      >
        {quotes.map((q, i) => (
          <blockquote key={i} className={q.highlighted ? styles.highlighted : undefined}>
            <p className={styles.text}>"{q.text}"</p>
            {(q.author || q.source) && (
              <footer className={styles.footer}>
                {q.author && <cite className={styles.author}>{q.author}</cite>}
                {q.source && <span className={styles.source}> – {q.source}</span>}
              </footer>
            )}
          </blockquote>
        ))}
      </Box>
    );
  }
);

export default memo(QuoteWall);
