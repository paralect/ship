import { CreditCard, Database, Mail, Palette, Shield, Zap } from 'lucide-react';

import { GlowingEffect } from '@/components/ui/glowing-effect';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Setup',
    description: 'Get your project up and running in minutes with our CLI tool. No complex configuration needed.',
    color: 'bg-cyan-500/10 text-cyan-500',
  },
  {
    icon: Shield,
    title: 'Authentication Ready',
    description: 'Secure authentication with email/password, social logins, and email verification out of the box.',
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    icon: Mail,
    title: 'Email Integration',
    description: 'Pre-configured email service with beautiful templates for transactional emails.',
    color: 'bg-neutral-500/10 text-neutral-400',
  },
  {
    icon: CreditCard,
    title: 'Payment Integration',
    description: 'Stripe integration ready to accept payments with subscription management.',
    color: 'bg-cyan-500/10 text-cyan-500',
  },
  {
    icon: Database,
    title: 'Database & API',
    description: 'MongoDB with a powerful API layer using Koa.js. Type-safe with Zod validation.',
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    icon: Palette,
    title: 'Modern UI Components',
    description: 'Beautiful shadcn/ui components with Tailwind CSS. Dark mode included.',
    color: 'bg-neutral-500/10 text-neutral-400',
  },
];

export const Features = () => {
  return (
    <section id="features" className="relative overflow-hidden py-12 sm:py-16">
      <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 bottom-20 h-[400px] w-[400px] rounded-full bg-cyan-500/6 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to ship fast
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Stop wasting time on boilerplate. Ship comes with all the features you need to build your SaaS.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="group relative rounded-2xl border-[0.75px] border-border p-2">
              <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
              <div className="relative flex h-full flex-col rounded-xl border-[0.75px] bg-card p-6 shadow-sm">
                <div className={`flex size-12 items-center justify-center rounded-xl ${feature.color.split(' ')[0]}`}>
                  <feature.icon className={`size-6 ${feature.color.split(' ').slice(1).join(' ')}`} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
