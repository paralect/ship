'use client';

import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';

import { cn } from '@/lib/utils';

const technologies = [
  {
    name: 'Next.js',
    icon: (
      <svg viewBox="0 0 180 180" className="size-10">
        <mask height="180" id="mask0_408_134" maskUnits="userSpaceOnUse" width="180" x="0" y="0">
          <circle cx="90" cy="90" r="90" fill="currentColor" />
        </mask>
        <g mask="url(#mask0_408_134)">
          <circle cx="90" cy="90" r="90" fill="currentColor" />
          <path
            d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z"
            className="fill-background"
          />
          <rect className="fill-background" height="72" width="12" x="115" y="54" />
        </g>
      </svg>
    ),
    color: 'from-zinc-400 to-zinc-600',
    glowColor: 'group-hover:shadow-zinc-500/50',
  },
  {
    name: 'React',
    icon: (
      <svg viewBox="-11.5 -10.232 23 20.463" className="size-10">
        <circle r="2.05" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
    color: 'from-cyan-400 to-cyan-600',
    glowColor: 'group-hover:shadow-cyan-500/50',
  },
  {
    name: 'TypeScript',
    icon: (
      <svg viewBox="0 0 128 128" className="size-10">
        <path
          fill="currentColor"
          d="M2 63.91v62.5h125v-125H2zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1A23 23 0 0180 109.19c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73l4.6-2.64 3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H57.16v46.23H45.65V69.26H29.38v-5a49.19 49.19 0 01.14-5.16c.06-.08 10-.12 22-.1h21.81z"
        />
      </svg>
    ),
    color: 'from-blue-400 to-blue-600',
    glowColor: 'group-hover:shadow-blue-500/50',
  },
  {
    name: 'Node.js',
    icon: (
      <svg viewBox="0 0 256 289" className="size-10">
        <path
          fill="currentColor"
          d="M128 288.464c-3.975 0-7.685-1.06-11.13-2.915l-35.247-20.936c-5.3-2.915-2.65-3.975-1.06-4.505 7.155-2.385 8.48-2.915 15.9-7.156.795-.53 1.856-.265 2.65.265l27.032 16.166c1.06.53 2.385.53 3.18 0l105.74-61.217c1.06-.53 1.59-1.59 1.59-2.915V83.08c0-1.325-.53-2.385-1.59-2.915l-105.74-60.953c-1.06-.53-2.385-.53-3.18 0L20.705 80.166c-1.06.53-1.59 1.855-1.59 2.915v122.17c0 1.06.53 2.385 1.59 2.915l28.887 16.695c15.636 7.95 25.44-1.325 25.44-10.6V93.68c0-1.59 1.326-3.18 3.18-3.18h13.516c1.59 0 3.18 1.325 3.18 3.18v120.58c0 20.936-11.396 33.126-31.272 33.126-6.095 0-10.865 0-24.38-6.625l-27.827-15.9C4.24 220.353 0 213.197 0 205.51V83.345c0-7.685 4.24-14.84 11.13-18.55L116.87 3.58c6.625-3.71 15.635-3.71 22.26 0l105.74 61.216c6.89 3.975 11.13 11.13 11.13 18.55v122.17c0 7.686-4.24 14.841-11.13 18.816L139.13 285.55c-3.445 1.59-7.42 2.385-11.13 2.915z"
        />
      </svg>
    ),
    color: 'from-emerald-400 to-emerald-600',
    glowColor: 'group-hover:shadow-emerald-500/50',
  },
  {
    name: 'MongoDB',
    icon: (
      <svg viewBox="0 0 256 549" className="size-10">
        <path
          fill="currentColor"
          d="M175.622 61.108C152.612 33.807 132.797 6.078 128.749.32a1.03 1.03 0 00-1.492 0c-4.048 5.759-23.863 33.487-46.874 60.788-197.507 251.896 31.108 421.89 31.108 421.89l1.917 1.28c1.704 26.234 5.966 63.988 5.966 63.988h17.045s4.26-37.54 5.965-63.987l1.918-1.494c0 .213 228.828-169.78 31.32-421.677zm-47.726 418.05s-10.227-8.744-12.997-13.222v-.428l12.358-274.292c0-.853 1.279-.853 1.279 0l12.357 274.292v.428c-2.77 4.478-12.997 13.223-12.997 13.223z"
        />
      </svg>
    ),
    color: 'from-green-400 to-green-600',
    glowColor: 'group-hover:shadow-green-500/50',
  },
  {
    name: 'Tailwind',
    icon: (
      <svg viewBox="0 0 256 154" className="size-10">
        <path
          fill="currentColor"
          d="M128 0C93.867 0 72.533 17.067 64 51.2 76.8 34.133 91.733 27.733 108.8 32c9.737 2.434 16.697 9.499 24.401 17.318C145.751 62.057 160.275 76.8 192 76.8c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C174.249 14.743 159.725 0 128 0zM64 76.8C29.867 76.8 8.533 93.867 0 128c12.8-17.067 27.733-23.467 44.8-19.2 9.737 2.434 16.697 9.499 24.401 17.318C81.751 138.857 96.275 153.6 128 153.6c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C110.249 91.543 95.725 76.8 64 76.8z"
        />
      </svg>
    ),
    color: 'from-cyan-400 to-teal-500',
    glowColor: 'group-hover:shadow-cyan-500/50',
  },
];

interface TechCardProps {
  tech: (typeof technologies)[0];
}

const TechCard = ({ tech }: TechCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const maxRotate = 15;
    const rotateXValue = (mouseY / (rect.height / 2)) * -maxRotate;
    const rotateYValue = (mouseX / (rect.width / 2)) * maxRotate;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovering(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative"
      style={{ perspective: '1000px' }}
    >
      <div
        className={cn(
          'pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r opacity-0 blur-xl transition-opacity duration-500',
          tech.color,
          isHovering && 'opacity-60',
        )}
      />

      <div
        className={cn(
          'relative flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-200',
          'shadow-lg',
          tech.glowColor,
        )}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className={cn(
            'text-muted-foreground transition-all duration-300',
            'group-hover:scale-110',
            isHovering && 'text-foreground',
          )}
        >
          {tech.icon}
        </div>

        <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
          {tech.name}
        </span>

        <div
          className={cn(
            'absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r transition-all duration-300',
            tech.color,
            'group-hover:w-3/4',
          )}
        />
      </div>
    </div>
  );
};

export const Logos = () => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-cyan-500/8 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-emerald-500/6 blur-[80px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Built with modern technologies</h2>
          <p className="mt-3 text-muted-foreground">
            Carefully selected tools for performance, scalability, and developer experience
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {technologies.map((tech) => (
            <TechCard key={tech.name} tech={tech} />
          ))}
        </div>
      </div>
    </section>
  );
};
