import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const CTA = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-20 sm:px-16 sm:py-28">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute size-[200px] -translate-x-1/2 -translate-y-1/2 animate-[pulse-ring_4s_ease-out_infinite] rounded-full border border-cyan-500/20" />
            <div className="absolute size-[350px] -translate-x-1/2 -translate-y-1/2 animate-[pulse-ring_4s_ease-out_0.5s_infinite] rounded-full border border-cyan-500/15" />
            <div className="absolute size-[500px] -translate-x-1/2 -translate-y-1/2 animate-[pulse-ring_4s_ease-out_1s_infinite] rounded-full border border-cyan-500/10" />
            <div className="absolute size-[650px] -translate-x-1/2 -translate-y-1/2 animate-[pulse-ring_4s_ease-out_1.5s_infinite] rounded-full border border-emerald-500/10" />
            <div className="absolute size-[800px] -translate-x-1/2 -translate-y-1/2 animate-[pulse-ring_4s_ease-out_2s_infinite] rounded-full border border-emerald-500/5" />
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Ready to ship your product?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of developers who are building faster with Ship. Start your free trial today.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/sign-up">
                  Get Started for Free
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/blog">View Documentation</Link>
              </Button>
            </div>
          </div>

          <div className="absolute -left-20 -top-20 size-60 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 size-60 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
};
