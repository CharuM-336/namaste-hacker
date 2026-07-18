import React, { forwardRef, memo } from 'react';
import { Box } from '../../../../design-system/primitives/Box';

export interface MindMapPreviewProps {
  [key: string]: any;
}

const MindMapPreview = forwardRef<HTMLDivElement, MindMapPreviewProps>((props, ref) => (
  <Box ref={ref} {...props}>
    {/* Placeholder MindMapPreview component */}
    MindMapPreview Component
  </Box>
));

export default memo(MindMapPreview);
