import React, { FC } from 'react';
import { Center, CenterProps, Text, TextProps } from '@mantine/core';

interface EmptyStateProps extends CenterProps {
  text?: string;
  textProps?: TextProps;
}

const EmptyState: FC<EmptyStateProps> = ({ text, textProps, ...rest }) => (
  <Center py={100} {...rest}>
    <Text w="fit-content" size="xl" c="gray" {...textProps}>
      {text || 'No results found, try to adjust your search.'}
    </Text>
  </Center>
);

export default EmptyState;
