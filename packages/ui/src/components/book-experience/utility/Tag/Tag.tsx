import React, { forwardRef, memo } from 'react';
import { Box } from '../../../../design-system/primitives/Box';

export interface TagProps {
  [key: string]: any;
}

const Tag = forwardRef<HTMLDivElement, TagProps>((props, ref) => (
  <Box ref={ref} {...props}>
    {/* Placeholder Tag component */}
    Tag Component
  </Box>
));

export default memo(Tag);
