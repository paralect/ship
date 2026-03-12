import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { Button } from './ui/button';

export const Hero = () => {
  return (
    <section className="bg-background">
      <div className="relative py-24 md:pt-36">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] overflow-hidden">
          <div className="absolute inset-x-0 -top-40 h-[600px] bg-gradient-to-b from-orange-200/40 via-orange-100/20 to-transparent dark:from-orange-500/15 dark:via-orange-400/5 dark:to-transparent" />
          <div className="absolute -left-20 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-rose-200/30 to-transparent blur-3xl dark:from-rose-500/10" />
          <div className="absolute -right-20 top-20 h-[350px] w-[350px] rounded-full bg-gradient-to-bl from-amber-200/30 to-transparent blur-3xl dark:from-amber-500/10" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-balance font-serif text-4xl font-medium sm:text-5xl">
              Ship your SaaS in days, not months.
            </h1>
            <p className="text-muted-foreground mt-4 text-balance">
              The high-performance toolkit for developers. Authentication, payments, emails, and more — all configured
              and ready to go.
            </p>

            <Button asChild className="mt-6 pr-1.5">
              <Link href="/sign-up">
                <span className="text-nowrap">Get Started</span>
                <ChevronRight className="opacity-50" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
