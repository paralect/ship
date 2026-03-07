'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const screenshots = [
  {
    src: '/images/screen_chat.png',
    alt: 'AI Chat Interface',
    label: 'Chat',
  },
  {
    src: '/images/screen_admin.png',
    alt: 'Admin Dashboard',
    label: 'Admin',
  },
  {
    src: '/images/screen_profile.png',
    alt: 'User Profile',
    label: 'Profile',
  },
];

export const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % screenshots.length);
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan-500" />
            </span>
            <span className="text-cyan-700 dark:text-cyan-300">Ship your SaaS faster</span>
          </div>

          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl">
            The fastest way to build your{' '}
            <span className="bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              SaaS product
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Ship is a full-stack boilerplate that comes with everything you need to build production-ready web
            applications. Authentication, payments, emails, and more — all configured and ready to go.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full bg-white text-black hover:bg-neutral-100 dark:bg-white dark:text-black dark:hover:bg-neutral-200 sm:w-auto"
            >
              <Link href="/sign-up">
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/blog">Learn more</Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-16 sm:mt-20">
          <button
            onClick={goToPrev}
            className="absolute -left-4 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-background/80 text-muted-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:text-foreground sm:left-0"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute -right-4 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-background/80 text-muted-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:text-foreground sm:right-0"
          >
            <ChevronRight className="size-6" />
          </button>

          <div
            className="relative mx-auto h-[300px] max-w-4xl sm:h-[400px] lg:h-[500px]"
            style={{ perspective: '1000px' }}
          >
            {screenshots.map((screenshot, index) => {
              const offset = (index - activeIndex + screenshots.length) % screenshots.length;
              const normalizedOffset = offset > screenshots.length / 2 ? offset - screenshots.length : offset;

              return (
                <button
                  key={screenshot.label}
                  onClick={() => (normalizedOffset === 0 ? setLightboxImage(screenshot.src) : setActiveIndex(index))}
                  className={cn(
                    'absolute left-1/2 top-0 w-[85%] max-w-3xl overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl transition-all duration-500 ease-out sm:w-[75%]',
                    normalizedOffset === 0 && 'z-10 cursor-zoom-in hover:border-cyan-500/50',
                    normalizedOffset !== 0 && 'cursor-pointer',
                  )}
                  style={{
                    transform: `
                      translateX(-50%)
                      translateX(${normalizedOffset * 60}%)
                      translateZ(${-Math.abs(normalizedOffset) * 150}px)
                      rotateY(${normalizedOffset * -15}deg)
                    `,
                    opacity: Math.abs(normalizedOffset) > 1 ? 0 : 1 - Math.abs(normalizedOffset) * 0.4,
                    pointerEvents: Math.abs(normalizedOffset) > 1 ? 'none' : 'auto',
                  }}
                >
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    width={1200}
                    height={800}
                    className="h-auto w-full"
                  />
                  {normalizedOffset === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        <span className="size-1.5 rounded-full bg-cyan-400" />
                        {screenshot.label}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {screenshots.map((_, index) => (
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

          <div className="pointer-events-none absolute -left-40 -top-40 size-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 size-80 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
      </div>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-6" />
          </button>
          <Image
            src={lightboxImage}
            alt="Screenshot"
            width={1600}
            height={1000}
            className="max-h-[90vh] w-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};
