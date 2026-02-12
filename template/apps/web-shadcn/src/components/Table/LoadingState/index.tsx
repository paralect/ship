import { FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  rowsCount?: number;
  className?: string;
}

const LoadingState: FC<LoadingStateProps> = ({ rowsCount = 3, className }) => (
  <div className={`flex flex-col gap-3 ${className ?? ''}`}>
    {Array.from({ length: rowsCount }, (_, i) => (
      <Skeleton key={i} className="h-[60px] w-full rounded-sm" />
    ))}
  </div>
);

export default LoadingState;
