import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

const screenshots = [
  {
    src: '/images/screen_chat.png',
    srcMobile: '/images/screen_chat_mob.png',
    title: 'AI Chat Interface',
    description: 'Built-in AI assistant with real-time streaming.',
    url: 'app.ship.dev/chat',
  },
  {
    src: '/images/screen_admin.png',
    srcMobile: '/images/screen_admin_mob.png',
    title: 'Admin Dashboard',
    description: 'Powerful user management and analytics.',
    url: 'app.ship.dev/admin',
  },
  {
    src: '/images/screen_profile.png',
    srcMobile: '/images/screen_profile_mob.png',
    title: 'User Profile',
    description: 'Complete authentication and profile control.',
    url: 'app.ship.dev/profile',
  },
];

const Hero: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextScreenshot = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevScreenshot = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  useEffect(() => {
    const timer = setInterval(nextScreenshot, 5000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-[10%] top-[10%] h-[50%] w-[50%] rounded-full bg-[var(--color-landing-teal)]/10 blur-[150px]" />
        <div className="absolute -right-[10%] top-[20%] h-[50%] w-[50%] rounded-full bg-[var(--color-landing-orange)]/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-1/2 h-[60%] w-[60%] -translate-x-1/2 rounded-full bg-[var(--color-landing-cyan)]/10 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-3 rounded-xl border-4 border-foreground bg-background px-6 py-2.5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all cursor-default"
          >
            <Sparkles className="size-4 text-[var(--color-landing-teal)] fill-current" />
            <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-foreground">
              Ship: <span className="text-[var(--color-landing-teal)]">v2.4.0</span> {/* PRODUCTION READY */}
            </span>
          </motion.div>

          <h1 className="font-mono text-4xl font-black tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            BUILD. SHIP.
            <br />
            <span className="bg-gradient-to-r from-[var(--color-landing-teal)] via-[var(--color-landing-cyan)] to-[var(--color-landing-orange)] bg-clip-text text-transparent italic">
              SCALE.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl font-mono text-lg font-medium leading-relaxed text-muted-foreground md:text-xl">
            The ultimate modern toolkit for high-performance SaaS. Launch in days, not months. Focus on your product.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="group h-14 px-10 font-mono text-lg font-bold bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/sign-up">
                Start Building
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 px-10 font-mono text-lg font-bold bg-background/50 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 border-2"
            >
              <Link href="#features">Features</Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative size-8 overflow-hidden rounded-full border-2 border-background bg-muted"
                >
                  <Image
                    src={`https://i.pravatar.cc/150?u=${i}`}
                    alt="User avatar"
                    fill
                    className="rounded-full grayscale hover:grayscale-0 transition-all duration-300 object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Trusted by 500+ devs
            </p>
          </div>
        </div>

        <div className="relative mx-auto mt-24 max-w-6xl">
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-[var(--color-landing-teal)] via-[var(--color-landing-cyan)] to-[var(--color-landing-orange)] blur-2xl opacity-20" />

          <div className="relative overflow-hidden rounded-2xl border-4 border-foreground bg-background shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3 border-b-4 border-foreground bg-muted px-6 py-4 z-20 relative">
              <div className="flex gap-2">
                <div className="size-4 rounded-full border-2 border-foreground" />
                <div className="size-4 rounded-full border-2 border-foreground" />
                <div className="size-4 rounded-full border-2 border-foreground bg-foreground" />
              </div>
              <div className="ml-4 flex-1 rounded-lg border-2 border-foreground bg-background px-4 py-1.5 font-mono text-sm font-bold text-muted-foreground mr-12 text-center truncate">
                {screenshots[currentIndex].url}
              </div>
            </div>

            <div className="relative aspect-[16/10] bg-muted/20 overflow-hidden hidden md:block">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={screenshots[currentIndex].src}
                    alt={screenshots[currentIndex].title}
                    fill
                    className="object-cover object-top grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
                    priority
                  />

                  <div className="absolute bottom-8 left-8 right-8 z-30">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="inline-block rounded-lg border-2 border-foreground bg-background p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <h4 className="font-mono text-sm font-bold uppercase tracking-wider">
                        {screenshots[currentIndex].title}
                      </h4>
                      <p className="font-mono text-xs text-muted-foreground mt-1">
                        {screenshots[currentIndex].description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile carousel */}
            <div className="relative aspect-[9/16] bg-muted/20 overflow-hidden md:hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={`mobile-${currentIndex}`}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={screenshots[currentIndex].srcMobile}
                    alt={screenshots[currentIndex].title}
                    fill
                    className="object-cover object-top grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
                    priority
                  />

                  <div className="absolute bottom-4 left-4 right-4 z-30">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="inline-block rounded-lg border-2 border-foreground bg-background p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider">
                        {screenshots[currentIndex].title}
                      </h4>
                      <p className="font-mono text-[10px] text-muted-foreground mt-1">
                        {screenshots[currentIndex].description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2 z-40">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={prevScreenshot}
                className="size-10 border-2 border-foreground bg-background hover:bg-muted active:translate-y-1 transition-all"
              >
                <ArrowLeft className="size-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={nextScreenshot}
                className="size-10 border-2 border-foreground bg-background hover:bg-muted active:translate-y-1 transition-all"
              >
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            {screenshots.map((screenshot, idx) => (
              <button
                type="button"
                key={screenshot.src}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-3 rounded-full border-2 border-foreground transition-all duration-300 ${
                  idx === currentIndex ? 'w-12 bg-foreground' : 'w-3 bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
