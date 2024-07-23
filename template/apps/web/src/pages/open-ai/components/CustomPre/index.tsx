import React from 'react';
import { Text } from '@mantine/core';

import classes from './index.module.css';

interface CustomPreProps {
  children: React.ReactNode;
}

const CustomPre: React.FC<CustomPreProps> = ({ children }) => (
  <Text component="pre" className={classes.pre}>
    {children}
  </Text>
);

export default CustomPre;
