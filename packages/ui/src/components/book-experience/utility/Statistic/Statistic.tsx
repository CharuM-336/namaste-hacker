import React, { forwardRef, memo } from 'react';
import { Box } from '../../../../design-system/primitives/Box';

export interface StatisticProps {
  [key: string]: any;
}

const Statistic = forwardRef<HTMLDivElement, StatisticProps>((props, ref) => (
  <Box ref={ref} {...props}>
    {/* Placeholder Statistic component */}
    Statistic Component
  </Box>
));

export default memo(Statistic);
