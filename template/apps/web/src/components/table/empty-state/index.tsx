import { FC } from 'react';

interface EmptyStateProps {
  text?: string;
  className?: string;
}

const EmptyState: FC<EmptyStateProps> = ({ text, className }) => (
  <div className={`flex items-center justify-center py-24 ${className ?? ''}`}>
    <p className="w-fit text-xl text-muted-foreground">{text || 'No results found, try to adjust your search.'}</p>
  </div>
);

export default EmptyState;
