// src/design-system/primitives/Box.tsx
import React, { forwardRef, HTMLAttributes } from "react";
import classNames from "classnames";
import "./Box.css"; // optional, will generate via CSS variables

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  /** Additional CSS class names */
  className?: string;
  /** Children elements */
  children?: React.ReactNode;
  /** sx prop for inline style overrides using token values */
  sx?: React.CSSProperties;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ className, children, sx, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames("box", className)}
        style={sx}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export default Box;
