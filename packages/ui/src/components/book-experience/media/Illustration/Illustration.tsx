// src/components/book-experience/media/Illustration/Illustration.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "@namaste-hacker/ui/design-system/primitives/Box";
import { colors, spacing, radius, shadows } from "@namaste-hacker/ui/design-system/tokens";
import styles from "./Illustration.module.css";

export interface IllustrationProps {
  svg: React.ReactNode; // could be imported SVG component
  alt: string;
  caption?: string;
  responsive?: boolean;
  variant?: "default" | "compact";
  loading?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Illustration = forwardRef<HTMLDivElement, IllustrationProps>(
  (
    {
      svg,
      alt,
      caption,
      responsive = true,
      variant = "default",
      loading = false,
      error = false,
      className,
      style,
    },
    ref,
  ) => {
    if (loading) return <div className={styles.loading}>Loading…</div>;
    if (error) return <div className={styles.error}>Failed to load illustration.</div>;
    return (
      <Box
        ref={ref}
        className={`${styles.illustration} ${styles[variant]} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.sm,
          boxShadow: shadows.sm,
        }}
        role="img"
        aria-label={alt}
      >
        <div className={responsive ? styles.responsive : undefined}>{svg}</div>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </Box>
    );
  },
);

export default memo(Illustration);
