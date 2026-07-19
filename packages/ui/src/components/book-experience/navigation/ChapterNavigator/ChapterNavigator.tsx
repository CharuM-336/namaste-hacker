// src/components/book-experience/navigation/ChapterNavigator/ChapterNavigator.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "@namaste-hacker/ui/design-system/primitives/Box";
import {
  colors,
  spacing,
  radius,
  shadows,
  typography,
} from "@namaste-hacker/ui/design-system/tokens";
import styles from "./ChapterNavigator.module.css";

export interface ChapterItem {
  id: string;
  title: string;
  disabled?: boolean;
}

export interface ChapterNavigatorProps {
  currentChapterId: string;
  chapters: ChapterItem[];
  showPrevNext?: boolean;
  expandable?: boolean;
  variant?: "default" | "compact";
  loading?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
  // Future callbacks (optional now)
  // onSelect?: (id: string) => void;
}

const ChapterNavigator = forwardRef<HTMLDivElement, ChapterNavigatorProps>(
  (
    {
      currentChapterId,
      chapters,
      showPrevNext = true,
      expandable = false,
      variant = "default",
      loading = false,
      error = false,
      className,
      style,
    },
    ref,
  ) => {
    if (loading) return <div className={styles.loading}>Loading…</div>;
    if (error)
      return <div className={styles.error}>Failed to load chapters.</div>;

    const currentIndex = chapters.findIndex((c) => c.id === currentChapterId);
    const prev = chapters[currentIndex - 1];
    const next = chapters[currentIndex + 1];

    return (
      <Box
        ref={ref}
        className={`${styles.navigator} ${styles[variant]} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          boxShadow: shadows.sm,
        }}
        role="navigation"
        aria-label="Chapter navigation"
      >
        {showPrevNext && prev && (
          <button
            className={styles.prev}
            disabled={prev.disabled}
            aria-label={`Previous: ${prev.title}`}
          >
            ← {prev.title}
          </button>
        )}
        <ul className={styles.list} role="list">
          {chapters.map((ch) => (
            <li
              key={ch.id}
              className={`${styles.item} ${ch.id === currentChapterId ? styles.active : ""}`}
            >
              <button
                disabled={ch.disabled}
                className={styles.link}
                aria-current={ch.id === currentChapterId ? "page" : undefined}
              >
                {ch.title}
              </button>
            </li>
          ))}
        </ul>
        {showPrevNext && next && (
          <button
            className={styles.next}
            disabled={next.disabled}
            aria-label={`Next: ${next.title}`}
          >
            {" "}
            {next.title} →
          </button>
        )}
      </Box>
    );
  },
);

export default memo(ChapterNavigator);
