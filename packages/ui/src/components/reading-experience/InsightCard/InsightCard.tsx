// src/components/reading-experience/InsightCard/InsightCard.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "../../../design-system/primitives/Box";
import { colors, spacing, radius, typography } from "../../../design-system/tokens";
import styles from "./InsightCard.module.css";

export interface InsightCardProps {
  title: string;
  insight: string;
  confidence?: number; // 0-100
  relatedConcepts?: string[];
  importance?: "low" | "medium" | "high";
  className?: string;
  style?: React.CSSProperties;
}

const InsightCard = forwardRef<HTMLDivElement, InsightCardProps>(
  ({ title, insight, confidence, relatedConcepts = [], importance = "low", className, style }, ref) => {
    const borderColor =
      importance === "high"
        ? colors.primary
        : importance === "medium"
        ? colors.textPrimary
        : colors.textSecondary;
    return (
      <Box
        ref={ref}
        className={`${styles.insightCard} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.surface,
          borderLeft: `4px solid ${borderColor}`,
          borderRadius: radius.md,
          padding: spacing.md,
        }}
      >
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.insight}>{insight}</p>
        {confidence !== undefined && (
          <div className={styles.confidence}>Confidence: {confidence}%</div>
        )}
        {relatedConcepts.length > 0 && (
          <ul className={styles.related}>
            {relatedConcepts.map((c) => (
              <li key={c} className={styles.concept}>
                {c}
              </li>
            ))}
          </ul>
        )}
      </Box>
    );
  }
);

export default memo(InsightCard);
