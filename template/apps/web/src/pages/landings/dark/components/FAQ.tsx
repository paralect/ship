'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'What is Ship?',
    answer:
      'Ship is a full-stack SaaS boilerplate that includes everything you need to build production-ready web applications. It comes with authentication, payments, emails, database setup, and modern UI components.',
  },
  {
    question: 'What technologies does Ship use?',
    answer:
      'Ship is built with Next.js, React, TypeScript, Node.js (Koa), MongoDB, and Tailwind CSS. It uses shadcn/ui for components and Stripe for payments.',
  },
  {
    question: 'Is Ship suitable for beginners?',
    answer:
      'Yes! Ship is designed to be beginner-friendly while still providing advanced features for experienced developers. Our documentation covers everything you need to get started.',
  },
  {
    question: 'Can I use Ship for commercial projects?',
    answer:
      'Absolutely. Ship is licensed for both personal and commercial use. You can build and sell products using Ship without any restrictions.',
  },
  {
    question: 'Do you offer support?',
    answer:
      'Yes, we offer community support through our Discord channel for all users. Pro and Enterprise plans include priority support with faster response times.',
  },
  {
    question: 'What about updates?',
    answer:
      'We regularly update Ship with new features, security patches, and improvements. All updates are included in your purchase.',
  },
];

export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="faq" className="relative overflow-hidden py-12 sm:py-16">
      <div className="pointer-events-none absolute -left-40 top-10 h-[400px] w-[400px] rounded-full bg-cyan-500/8 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[350px] w-[350px] rounded-full bg-emerald-500/6 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Can&apos;t find the answer you&apos;re looking for? Reach out to our support team.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <button
                type="button"
                key={faq.question}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'group flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left transition-all',
                  activeIndex === index
                    ? 'border-cyan-500/50 bg-cyan-500/10 shadow-sm'
                    : 'border-transparent bg-card hover:border-border hover:bg-muted/50',
                )}
              >
                <span
                  className={cn(
                    'text-sm font-medium transition-colors sm:text-base',
                    activeIndex === index ? 'text-cyan-700 dark:text-cyan-300' : 'text-foreground',
                  )}
                >
                  {faq.question}
                </span>
                <ChevronRight
                  className={cn(
                    'size-4 shrink-0 transition-transform',
                    activeIndex === index
                      ? 'rotate-90 text-cyan-500'
                      : 'text-muted-foreground group-hover:translate-x-0.5',
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex items-start">
            <div className="sticky top-24 w-full rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                <span className="size-1.5 rounded-full bg-cyan-500" />
                Answer
              </div>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{faqs[activeIndex].answer}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
