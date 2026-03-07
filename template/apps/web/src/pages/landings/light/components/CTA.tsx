import { FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';

const CTA: FC = () => {
  return (
    <section className="relative overflow-hidden border-y-4 border-foreground bg-background pt-8 pb-16 md:pt-12 md:pb-24">
      <div className="absolute inset-0 z-0 opacity-[0.2] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 20px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-foreground bg-[var(--color-landing-orange)] text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <Zap className="size-12 fill-current" />
        </motion.div>

        <h2 className="mt-12 font-mono text-5xl font-black tracking-tighter text-foreground sm:text-6xl md:text-7xl uppercase">
          Build better.
          <br />
          Launch <span className="text-[var(--color-landing-orange)]">faster.</span>
        </h2>

        <p className="mx-auto mt-8 max-w-xl font-mono text-xl font-bold leading-relaxed text-muted-foreground">
          Join hundreds of developers who have already transformed their development workflow. Start building today.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Button
            size="lg"
            asChild
            className="group h-20 px-12 font-mono text-2xl font-black uppercase tracking-tighter bg-foreground text-background border-4 border-foreground shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:scale-[1.02]"
          >
            <Link href="/sign-up">
              Get Started
              <ArrowRight className="ml-3 size-6 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>

        <p className="mt-10 font-mono text-xs font-black text-muted-foreground uppercase tracking-[0.4em]">
          No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default CTA;
