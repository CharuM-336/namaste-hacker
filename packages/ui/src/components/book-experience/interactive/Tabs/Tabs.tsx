// src/components/book-experience/interactive/Tabs/Tabs.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "@namaste-hacker/ui/design-system/primitives/Box";
import classNames from "classnames";
import styles from "./Tabs.module.css";

export interface TabItem {
  /** Label shown on the tab */
  label: string;
  /** Content rendered when the tab is active */
  content: React.ReactNode;
}

export interface TabsProps {
  /** List of tabs */
  tabs: TabItem[];
  /** Optional default active index */
  defaultIndex?: number;
  className?: string;
  style?: React.CSSProperties;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, defaultIndex = 0, className, style }, ref) => {
    const [active, setActive] = React.useState(defaultIndex);
    return (
      <Box
        ref={ref}
        className={classNames(styles.tabs, className)}
        style={style}
      >
        <div className={styles.tabList} role="tablist">
          {tabs.map((tab, i) => (
            <button
              key={i}
              className={classNames(styles.tab, {
                [styles.active]: i === active,
              })}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className={styles.tabPanel} role="tabpanel">
          {tabs[active]?.content}
        </div>
      </Box>
    );
  },
);

export default memo(Tabs);
