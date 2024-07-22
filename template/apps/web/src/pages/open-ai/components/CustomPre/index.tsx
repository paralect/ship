import React from 'react';
import { Text } from '@mantine/core';

interface CustomPreProps {
  children: React.ReactNode;
}

const CustomPre: React.FC<CustomPreProps> = ({ children }) => (
  <Text
    component="pre"
    m={0}
    maw="100%"
    style={{
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      flexGrow: 0,
    }}
  >
    {children}
  </Text>
);

export default CustomPre;
