import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const cardVariants = cva('text-card-foreground rounded-2xl', {
  variants: {
    variant: {
      default: 'bg-card ring-1 ring-foreground/6.5 shadow-lg shadow-foreground/5 dark:shadow-black/10',
      soft: 'bg-muted',
      mixed: 'bg-muted border',
      outline: 'bg-card ring-1 ring-border',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = ({ ref, className, variant, ...props }: CardProps & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
);
Card.displayName = 'Card';

const CardHeader = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);
CardHeader.displayName = 'CardHeader';

const CardTitle = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <div ref={ref} className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
);
CardTitle.displayName = 'CardTitle';

const CardDescription = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <div ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
);
CardDescription.displayName = 'CardDescription';

const CardContent = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
);
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
