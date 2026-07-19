// src/components/book-experience/navigation/Breadcrumb/Breadcrumb.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "../../../../design-system/primitives/Box";
import classNames from "classnames";
import styles from "./Breadcrumb.module.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  disabled?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  style?: React.CSSProperties;
}

const Breadcrumb = forwardRef<HTMLDivElement, BreadcrumbProps>(
  ({ items, className, style }, ref) => {
    return (
      <Box
        ref={ref}
        className={classNames(styles.breadcrumb, className)}
        style={style}
      >
        <nav aria-label="breadcrumb">
          <ol className={styles.list}>
            {items.map((item, idx) => (
              <li key={idx} className={styles.item}>
                {item.href && !item.disabled ? (
                  <a href={item.href} className={styles.link}>
                    {item.label}
                  </a>
                ) : (
                  <span className={styles.text}>{item.label}</span>
                )}
                {idx < items.length - 1 && (
                  <span className={styles.separator}>/</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Box>
    );
  },
);

export default memo(Breadcrumb);
