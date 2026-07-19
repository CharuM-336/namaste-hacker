// src/components/reading-experience/SummaryCard/SummaryCard.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "../../../design-system/primitives/Box";
import {
  colors,
  spacing,
  radius,
  typography,
} from "../../../design-system/tokens";
import styles from "./SummaryCard.module.css";

export interface SummaryCardProps {
  title: string;
  summary: string;
  bullets?: string[];
  readingTime?: string; // e.g. "5 min"
  expanded?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const SummaryCard = forwardRef<HTMLDivElement, SummaryCardProps>(
  (
    {
      title,
      summary,
      bullets = [],
      readingTime,
      expanded = false,
      className,
      style,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(expanded);
    const toggle = () => setIsOpen((prev) => !prev);
    return (
      <Box
        ref={ref}
        className={`${styles.summaryCard} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
        }}
      >
        <header
          className={styles.header}
          onClick={toggle}
          role="button"
          aria-expanded={isOpen}
        >
          <h4 className={styles.title}>{title}</h4>
          {readingTime && <span className={styles.time}>{readingTime}</span>}
        </header>
        {isOpen && (
          <div className={styles.content}>
            <p className={styles.summary}>{summary}</p>
            {bullets.length > 0 && (
              <ul className={styles.bullets}>
                {bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Box>
    );
  },
);

export default memo(SummaryCard);
