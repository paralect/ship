import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { cn } from 'lib/utils';

const titleVariants = cva('font-bold tracking-tight', {
  variants: {
    order: {
      1: 'text-4xl',
      2: 'text-3xl',
      3: 'text-2xl',
      4: 'text-xl',
      5: 'text-lg',
      6: 'text-base',
    },
  },
  defaultVariants: {
    order: 1,
  },
});

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof titleVariants> {
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  ref?: React.Ref<HTMLHeadingElement>;
}

const Title = ({ className, order = 1, children, ref, ...props }: TitleProps) => {
  const Tag = `h${order}` as const;

  return (
    <Tag ref={ref} className={cn(titleVariants({ order }), className)} {...props}>
      {children}
    </Tag>
  );
};

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
    weight: 'normal',
  },
});

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
  ref?: React.Ref<HTMLParagraphElement>;
}

const Text = ({ className, size, variant, weight, as: Tag = 'p', ref, ...props }: TextProps) => (
  <Tag ref={ref} className={cn(textVariants({ size, variant, weight }), className)} {...props} />
);

export { Text, Title };
