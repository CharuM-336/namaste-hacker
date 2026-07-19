// src/components/reading-experience/HighlightCard/HighlightCard.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "@namaste-hacker/ui/design-system/primitives/Box";
import {
  colors,
  spacing,
  radius,
  typography,
} from "@namaste-hacker/ui/design-system/tokens";
import styles from "./HighlightCard.module.css";

export interface HighlightCardProps {
  excerpt: string;
  chapter?: number;
  importance?: "low" | "medium" | "high";
  category?: string;
  colorVariant?: "default" | "accent";
  className?: string;
  style?: React.CSSProperties;
}

const HighlightCard = forwardRef<HTMLDivElement, HighlightCardProps>(
  (
    {
      excerpt,
      chapter,
      importance = "low",
      category,
      colorVariant = "default",
      className,
      style,
    },
    ref,
  ) => {
    const borderColor =
      importance === "high"
        ? colors.error
        : importance === "medium"
          ? colors.warning
          : colors.textSecondary;
    const bgColor = colorVariant === "accent" ? colors.primary : colors.surface;
    const textColor =
      colorVariant === "accent" ? colors.onPrimary : colors.textPrimary;
    return (
      <Box
        ref={ref}
        className={`${styles.highlightCard} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: bgColor,
          color: textColor,
          borderLeft: `4px solid ${borderColor}`,
          borderRadius: radius.md,
          padding: spacing.md,
        }}
      >
        <p className={styles.excerpt}>"{excerpt}"</p>
        {chapter && <span className={styles.chapter}>Chapter {chapter}</span>}
        {category && (
          <span className={styles.category}>Category: {category}</span>
        )}
      </Box>
    );
  },
);

export default memo(HighlightCard);
