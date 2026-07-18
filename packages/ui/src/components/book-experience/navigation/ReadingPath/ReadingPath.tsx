// src/components/book-experience/navigation/ReadingPath/ReadingPath.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "@namaste-hacker/ui/design-system/primitives/Box";
import { colors, spacing, radius } from "@namaste-hacker/ui/design-system/tokens";
import styles from "./ReadingPath.module.css";

export interface ReadingPathItem {
  id: string;
  label: string;
  url?: string;
  disabled?: boolean;
}

export interface ReadingPathProps {
  items: ReadingPathItem[];
  /** optional className */
  className?: string;
  /** optional style */
  style?: React.CSSProperties;
}

const ReadingPath = forwardRef<HTMLDivElement, ReadingPathProps>(
  ({ items, className, style }, ref) => {
    return (
      <Box
        ref={ref}
        className={`${styles.readingPath} ${className ?? ""}`}
        style={style}
      >
        <ul className={styles.list}>
          {items.map((item, idx) => (
            <li key={item.id} className={styles.item}>
              {item.url && !item.disabled ? (
                <a href={item.url} className={styles.link}>
                  {item.label}
                </a>
              ) : (
                <span className={styles.text}>{item.label}</span>
              )}
              {idx < items.length - 1 && <span className={styles.separator}>/</span>}
            </li>
          ))}
        </ul>
      </Box>
    );
  }
);

export default memo(ReadingPath);
