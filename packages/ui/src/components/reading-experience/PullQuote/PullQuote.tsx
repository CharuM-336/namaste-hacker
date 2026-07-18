// src/components/reading-experience/PullQuote/PullQuote.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "../../../design-system/primitives/Box"; // Box primitive
import { colors, spacing, radius, typography } from "../../../design-system/tokens";
import styles from "./PullQuote.module.css";

export interface PullQuoteProps {
  text: string;
  attribution?: string;
  variant?: "solid" | "outline";
  className?: string;
  style?: React.CSSProperties;
}

const PullQuote = forwardRef<HTMLDivElement, PullQuoteProps>(
  ({ text, attribution, variant = "solid", className, style }, ref) => {
    return (
      <Box
        ref={ref}
        className={`${styles.pullQuote} ${styles[variant]} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: variant === "solid" ? colors.primary : "transparent",
          color: variant === "solid" ? colors.onPrimary : colors.textPrimary,
          padding: spacing.lg,
          borderRadius: radius.lg,
          fontFamily: typography.fontFamily,
          fontSize: typography.fontSize.xl3,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        <blockquote className={styles.text}>"{text}"</blockquote>
        {attribution && <cite className={styles.attribution}>— {attribution}</cite>}
      </Box>
    );
  }
);

export default memo(PullQuote);
