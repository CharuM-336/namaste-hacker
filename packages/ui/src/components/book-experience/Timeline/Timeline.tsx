// src/components/book-experience/Timeline/Timeline.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "../../../design-system/primitives/Box";
import { colors, spacing, radius, typography, shadows } from "../../../design-system/tokens";
import styles from "./Timeline.module.css";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp?: string; // ISO string
  icon?: React.ReactNode;
}

export interface TimelineProps {
  events: TimelineEvent[];
  variant?: "vertical" | "horizontal";
  collapsible?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ events, variant = "vertical", collapsible = false, className, style }, ref) => {
    if (!events || events.length === 0) {
      return null;
    }
    return (
      <Box
        ref={ref}
        className={`${styles.timeline} ${styles[variant]} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.background,
          borderRadius: radius.md,
          padding: spacing.md,
          boxShadow: shadows.sm,
        }}
      >
        {events.map((e) => (
          <div key={e.id} className={styles.event}>
            {e.icon && <div className={styles.icon}>{e.icon}</div>}
            <div className={styles.content}>
              <h4 className={styles.title}>{e.title}</h4>
              {e.timestamp && <time className={styles.time}>{new Date(e.timestamp).toLocaleString()}</time>}
              {e.description && <p className={styles.description}>{e.description}</p>}
            </div>
          </div>
        ))}
      </Box>
    );
  }
);

export default memo(Timeline);
