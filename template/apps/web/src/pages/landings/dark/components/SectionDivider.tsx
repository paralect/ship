import { cn } from '@/lib/utils';

type DividerVariant = 'gradient' | 'dots' | 'circuit' | 'arrow' | 'pulse' | 'hexagon' | 'glow';

interface SectionDividerProps {
  variant?: DividerVariant;
  className?: string;
}

export const SectionDivider = ({ variant = 'gradient', className }: SectionDividerProps) => {
  if (variant === 'glow') {
    return (
      <div className={cn('relative py-16', className)}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent blur-xl" />
            <div className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-md" />
            <div className="relative h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 size-8 rounded-full bg-cyan-500/30 blur-md" />
                <div className="relative flex size-8 items-center justify-center">
                  <div className="size-3 rotate-45 border border-cyan-500/80 bg-cyan-500/20" />
                  <div className="absolute size-1.5 rotate-45 bg-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center py-10', className)}>
        <div className="relative flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500/60 sm:w-24" />
          <div className="relative">
            <div className="size-2 rotate-45 bg-cyan-500/80" />
            <div className="absolute inset-0 size-2 rotate-45 animate-ping bg-cyan-400/40" />
          </div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500/60 sm:w-24" />
        </div>
      </div>
    );
  }

  if (variant === 'hexagon') {
    return (
      <div className={cn('flex items-center justify-center py-10', className)}>
        <div className="flex items-center gap-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-cyan-500/40 sm:w-32" />
          <svg className="size-6 text-cyan-500/60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L21.5 7.5V16.5L12 22L2.5 16.5V7.5L12 2Z" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-cyan-500/40 sm:w-32" />
        </div>
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={cn('relative h-px w-full', className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center gap-2 py-8', className)}>
        {[...Array.from({ length: 5 })].map((_, i) => (
          <div
            key={i}
            className="size-1.5 rounded-full bg-cyan-500/50"
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circuit') {
    return (
      <div className={cn('relative py-8', className)}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <svg
            className="h-12 w-full text-cyan-500/30"
            viewBox="0 0 1200 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 24 H400 L420 12 H480 L500 24 H550"
              stroke="currentColor"
              strokeWidth="1"
              className="opacity-50"
            />
            <circle cx="600" cy="24" r="4" fill="currentColor" className="opacity-80" />
            <circle cx="600" cy="24" r="8" stroke="currentColor" strokeWidth="1" className="opacity-40" />
            <path
              d="M650 24 H700 L720 36 H780 L800 24 H1200"
              stroke="currentColor"
              strokeWidth="1"
              className="opacity-50"
            />
            <path d="M550 24 H592" stroke="currentColor" strokeWidth="1" className="opacity-50" />
            <path d="M608 24 H650" stroke="currentColor" strokeWidth="1" className="opacity-50" />
            <circle cx="420" cy="12" r="2" fill="currentColor" className="opacity-60" />
            <circle cx="500" cy="24" r="2" fill="currentColor" className="opacity-60" />
            <circle cx="720" cy="36" r="2" fill="currentColor" className="opacity-60" />
            <circle cx="800" cy="24" r="2" fill="currentColor" className="opacity-60" />
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'arrow') {
    return (
      <div className={cn('flex flex-col items-center justify-center py-6', className)}>
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-cyan-500/50" />
        <div className="flex items-center justify-center">
          <svg className="size-4 text-cyan-500/50" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 2 L8 10 M4 6 L8 10 L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    );
  }

  return null;
};
