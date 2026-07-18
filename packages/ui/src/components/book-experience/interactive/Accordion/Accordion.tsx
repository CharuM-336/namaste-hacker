// src/components/book-experience/interactive/Accordion/Accordion.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "@namaste-hacker/ui/design-system/primitives/Box";
import classNames from "classnames";
import styles from "./Accordion.module.css";

export interface AccordionItem {
  /** Header label */
  title: string;
  /** Content to show when expanded */
  content: React.ReactNode;
  /** Initially expanded */
  defaultExpanded?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  style?: React.CSSProperties;
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, className, style }, ref) => (
    <Box ref={ref} className={classNames(styles.accordion, className)} style={style}>
      {items.map((item, idx) => {
        const [expanded, setExpanded] = React.useState(!!item.defaultExpanded);
        return (
          <div key={idx} className={styles.item}>
            <div className={styles.header} onClick={() => setExpanded(!expanded)} role="button">
              {item.title}
            </div>
            {expanded && <div className={styles.content}>{item.content}</div>}
          </div>
        );
      })}
    </Box>
  )
);

export default memo(Accordion);
