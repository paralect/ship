'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const avatarColors = [
  'bg-cyan-500/20 text-cyan-500',
  'bg-emerald-500/20 text-emerald-500',
  'bg-neutral-500/20 text-neutral-400',
  'bg-cyan-500/20 text-cyan-500',
  'bg-emerald-500/20 text-emerald-500',
  'bg-neutral-500/20 text-neutral-400',
];

const testimonials = [
  {
    quote: 'Ship saved us weeks of development time. We launched our SaaS in just 2 weeks instead of 2 months.',
    author: 'Sarah Chen',
    role: 'CEO at TechStart',
  },
  {
    quote: 'The code quality is exceptional. Clean architecture, proper TypeScript usage, and great documentation.',
    author: 'Michael Rodriguez',
    role: 'Senior Developer at DevCorp',
  },
  {
    quote:
      'Finally, a boilerplate that actually works out of the box. No more spending hours fixing configuration issues.',
    author: 'Emily Johnson',
    role: 'Founder at LaunchPad',
  },
  {
    quote: "Best investment we've made. The authentication and payment integrations alone are worth it.",
    author: 'David Park',
    role: 'CTO at GrowthLabs',
  },
  {
    quote: 'Ship helped us validate our idea quickly. The pre-built components let us focus on what matters.',
    author: 'Anna Martinez',
    role: 'Product Manager at InnovateCo',
  },
  {
    quote: 'The developer experience is fantastic. Hot reload, type safety, and beautiful UI out of the box.',
    author: 'James Wilson',
    role: 'Full-Stack Developer',
  },
];

const TestimonialCard = ({
  testimonial,
  index,
  isActive,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
  isActive: boolean;
}) => (
  <div
    className={cn(
      'relative rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300',
      isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60',
    )}
  >
    {isActive && (
      <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-transparent to-emerald-500/20 blur-sm" />
    )}
    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">&quot;{testimonial.quote}&quot;</p>
    <div className="mt-6 flex items-center gap-3">
      <div
        className={`flex size-10 items-center justify-center rounded-full ${avatarColors[index % avatarColors.length]}`}
      >
        <span className="text-sm font-medium">{testimonial.author.charAt(0)}</span>
      </div>
      <div>
        <p className="text-sm font-medium">{testimonial.author}</p>
        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
      </div>
    </div>
  </div>
);

export const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const totalPairs = Math.ceil(testimonials.length / 2);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalPairs);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, totalPairs]);

  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <div className="pointer-events-none absolute right-1/4 top-0 h-[400px] w-[400px] rounded-full bg-emerald-500/8 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 bottom-20 h-[400px] w-[400px] rounded-full bg-cyan-500/6 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Loved by developers</h2>
          <p className="mt-4 text-lg text-muted-foreground">Here&apos;s what developers are saying about Ship.</p>
        </div>

        <div
          className="relative mt-12"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + totalPairs) % totalPairs)}
            className="absolute -left-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-card/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground sm:-left-12"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % totalPairs)}
            className="absolute -right-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-card/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground sm:-right-12"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {Array.from({ length: totalPairs }).map((_, pairIndex) => (
                <div key={pairIndex} className="grid w-full shrink-0 grid-cols-1 gap-4 px-2 sm:grid-cols-2">
                  {[testimonials[pairIndex * 2], testimonials[pairIndex * 2 + 1]].filter(Boolean).map((t, i) => (
                    <TestimonialCard
                      key={t.author}
                      testimonial={t}
                      index={pairIndex * 2 + i}
                      isActive={pairIndex === activeIndex}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPairs }).map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'size-2 rounded-full transition-all duration-300',
                  index === activeIndex ? 'w-6 bg-cyan-500' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
