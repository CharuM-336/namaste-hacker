import React, { forwardRef, memo } from "react";
import { Box } from "../../../../design-system/primitives/Box";

export interface QuizPreviewProps {
  [key: string]: any;
}

const QuizPreview = forwardRef<HTMLDivElement, QuizPreviewProps>(
  (props, ref) => (
    <Box ref={ref} {...props}>
      {/* Placeholder QuizPreview component */}
      QuizPreview Component
    </Box>
  ),
);

export default memo(QuizPreview);
