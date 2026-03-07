import { cn } from '@/lib/utils';

interface GlowingDividerProps {
  className?: string;
  color?: 'cyan' | 'emerald' | 'mixed';
}

export const GlowingDivider = ({ className }: GlowingDividerProps) => {
  return (
    <div className={cn('relative h-32 sm:h-40', className)}>
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-background" />

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div className="absolute inset-x-0 h-20 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent blur-2xl" />

        <div className="relative mx-auto max-w-4xl">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-transparent to-background" />
    </div>
  );
};
