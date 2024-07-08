import React, { FC } from 'react';
import { Skeleton, SkeletonProps, Stack, StackProps } from '@mantine/core';

interface LoadingStateProps extends StackProps {
  skeletonProps?: SkeletonProps;
  rowsCount?: number;
}

const LoadingState: FC<LoadingStateProps> = ({ rowsCount = 3, skeletonProps, ...rest }) => (
  <Stack gap="md" {...rest}>
    {Array.from(Array(rowsCount), (i) => (
      <Skeleton key={i} h={60} radius="sm" {...skeletonProps} />
    ))}
  </Stack>
);

export default LoadingState;
