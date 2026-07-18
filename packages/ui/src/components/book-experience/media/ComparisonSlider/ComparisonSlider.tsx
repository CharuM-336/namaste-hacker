// src/components/book-experience/media/ComparisonSlider/ComparisonSlider.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "@namaste-hacker/ui/design-system/primitives/Box";
import { colors, spacing, radius, shadows } from "@namaste-hacker/ui/design-system/tokens";
import styles from "./ComparisonSlider.module.css";

export interface ComparisonImage {
  src: string;
  alt: string;
}

export interface ComparisonSliderProps {
  before: ComparisonImage;
  after: ComparisonImage;
  initialRatio?: number; // 0‑1, default 0.5
  orientation?: "horizontal" | "vertical";
  variant?: "default";
  loading?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ComparisonSlider = forwardRef<HTMLDivElement, ComparisonSliderProps>(
  (
    {
      before,
      after,
      initialRatio = 0.5,
      orientation = "horizontal",
      loading = false,
      error = false,
      className,
      style,
    },
    ref,
  ) => {
    if (loading) return <div className={styles.loading}>Loading…</div>;
    if (error) return <div className={styles.error}>Failed to load comparison.</div>;
    // Simple static layout – interactive handle is a future extension
    return (
      <Box
        ref={ref}
        className={`${styles.comparisonSlider} ${styles[orientation]} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.sm,
          boxShadow: shadows.sm,
          position: "relative",
        }}
        role="group"
        aria-label="Before/After comparison"
      >
        <img src={before.src} alt={before.alt} className={styles.before} loading="lazy" />
        <img src={after.src} alt={after.alt} className={styles.after} loading="lazy" />
        {/* Placeholder for draggable handle – future interactive implementation */}
        <div className={styles.handle} />
      </Box>
    );
  },
);

export default memo(ComparisonSlider);
