import React, { memo } from 'react';

import CustomPre from '../CustomPre';

interface DynamicMessageProps {
  streamParts: string[];
}

const DynamicMessage: React.FC<DynamicMessageProps> = ({ streamParts }) => (
  <CustomPre>
    {streamParts.map((part) => (
      <React.Fragment key={crypto.randomUUID()}>{part}</React.Fragment>
    ))}
  </CustomPre>
);

export default memo(DynamicMessage);
