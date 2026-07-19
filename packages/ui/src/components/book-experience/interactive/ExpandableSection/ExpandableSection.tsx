// src/components/book-experience/interactive/ExpandableSection/ExpandableSection.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "@namaste-hacker/ui/design-system/primitives/Box";
import classNames from "classnames";
import styles from "./ExpandableSection.module.css";

export interface ExpandableSectionProps {
  /** Content to show when expanded */
  children: React.ReactNode;
  /** Optional header */
  title?: string;
  /** Whether the section is initially expanded */
  defaultExpanded?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ExpandableSection = forwardRef<HTMLDivElement, ExpandableSectionProps>(
  ({ children, title, defaultExpanded = false, className, style }, ref) => {
    const [expanded, setExpanded] = React.useState(defaultExpanded);
    return (
      <Box
        ref={ref}
        className={classNames(styles.expandableSection, className)}
        style={style}
      >
        {title && (
          <div
            className={styles.header}
            onClick={() => setExpanded(!expanded)}
            role="button"
          >
            {title}
          </div>
        )}
        {expanded && <div className={styles.content}>{children}</div>}
      </Box>
    );
  },
);

export default memo(ExpandableSection);
