import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from './ui/button';
import { Card } from './ui/card';

export const CTA = () => {
  return (
    <section className="bg-background @container relative py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[500px] overflow-hidden">
        <div className="absolute inset-x-0 -bottom-40 h-[600px] bg-gradient-to-t from-orange-200/40 via-orange-100/20 to-transparent dark:from-orange-500/15 dark:via-orange-400/5 dark:to-transparent" />
        <div className="absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-rose-200/30 to-transparent blur-3xl dark:from-rose-500/10" />
        <div className="absolute -right-20 bottom-20 h-[350px] w-[350px] rounded-full bg-gradient-to-tl from-amber-200/30 to-transparent blur-3xl dark:from-amber-500/10" />
      </div>

      <div className="mx-auto max-w-2xl px-6 relative z-10">
        <Card variant="outline" className="p-8 md:p-12">
          <div className="text-muted-foreground mb-6 text-sm font-medium">Ready to Ship?</div>
          <h2 className="text-balance font-serif text-3xl font-medium md:text-4xl">Build better. Launch faster.</h2>
          <p className="text-muted-foreground mt-4 max-w-md text-balance">
            Join hundreds of developers who have already transformed their development workflow. Start building today.
          </p>

          <Button asChild className="mt-8 gap-2">
            <Link href="/sign-up">
              Get Started
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Card>
      </div>
    </section>
  );
};
