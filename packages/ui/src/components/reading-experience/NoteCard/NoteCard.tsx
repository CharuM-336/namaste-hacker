// src/components/reading-experience/NoteCard/NoteCard.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "../../../design-system/primitives/Box";
import { colors, spacing, radius, typography } from "../../../design-system/tokens";
import styles from "./NoteCard.module.css";

export interface NoteCardProps {
  title: string;
  body: string;
  tags?: string[];
  category?: string;
  importance?: "low" | "medium" | "high";
  pinned?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const NoteCard = forwardRef<HTMLDivElement, NoteCardProps>(
  ({ title, body, tags = [], category, importance = "low", pinned = false, className, style }, ref) => {
    const importanceColor = importance === "high" ? colors.primary : importance === "medium" ? colors.textPrimary : colors.textSecondary;
    return (
      <Box
        ref={ref}
        className={`${styles.noteCard} ${pinned ? styles.pinned : ""} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          borderLeft: `4px solid ${importanceColor}`,
        }}
      >
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.body}>{body}</p>
        {tags.length > 0 && (
          <ul className={styles.tags}>
            {tags.map((t) => (
              <li key={t} className={styles.tag}>
                {t}
              </li>
            ))}
          </ul>
        )}
        {category && <div className={styles.category}>Category: {category}</div>}
      </Box>
    );
  }
);

export default memo(NoteCard);
