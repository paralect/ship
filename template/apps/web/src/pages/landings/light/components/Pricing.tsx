import { FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';

const Pricing: FC = () => {
  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for side projects and MVPs.',
      price: '$49',
      features: [
        'Single App License',
        'Next.js & Node.js API',
        'PostgreSQL or MongoDB',
        'Standard Email Support',
        'Lifetime Updates',
      ],
      buttonText: 'Get Started',
      variant: 'outline' as const,
      color: 'text-foreground',
      accent: 'border-foreground',
    },
    {
      name: 'Pro',
      description: 'Ideal for small startups and teams.',
      price: '$99',
      features: [
        'Unlimited App Licenses',
        'Premium Stripe integration',
        'Priority Slack Support',
        'Everything in Starter',
        'Docker & CI/CD Setup',
      ],
      buttonText: 'Buy Now',
      variant: 'default' as const,
      popular: true,
      color: 'text-[var(--color-landing-orange)]',
      accent: 'border-[var(--color-landing-orange)]',
      bg: 'bg-[var(--color-landing-orange)]/5',
    },
    {
      name: 'Enterprise',
      description: 'For teams needing high-touch support.',
      price: 'Contact',
      features: [
        'White-glove implementation',
        'Initial Audit & Setup',
        '24/7 Dedicated Support',
        'On-site Training',
        'Custom Extensions',
      ],
      buttonText: 'Contact Sales',
      variant: 'outline' as const,
      color: 'text-[var(--color-landing-teal)]',
      accent: 'border-[var(--color-landing-teal)]',
    },
  ];

  return (
    <section
      id="pricing"
      className="relative border-y-4 border-foreground bg-background pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden scroll-mt-20"
    >
      <div className="absolute inset-y-0 -left-[10%] w-[30%] pointer-events-none opacity-[0.08]">
        <div className="h-full w-full bg-[var(--color-landing-cyan)] blur-[120px] rounded-full" />
      </div>
      <div className="absolute inset-y-0 -right-[10%] w-[30%] pointer-events-none opacity-[0.08]">
        <div className="h-full w-full bg-[var(--color-landing-orange)] blur-[120px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-4 inline-block rounded-lg border-2 border-foreground bg-[var(--color-landing-cyan)]/10 px-4 py-1 font-mono text-xs font-black uppercase tracking-widest text-[var(--color-landing-cyan)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Pricing Models
          </motion.div>
          <h2 className="font-mono text-4xl font-black tracking-tighter text-foreground sm:text-5xl md:text-6xl uppercase">
            Straightforward <span className="text-muted-foreground italic">Pricing.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-mono text-lg font-medium text-muted-foreground">
            No monthly fees, only pay once and build. Everything you need is included.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -12 }}
              className={`relative flex flex-col rounded-3xl border-4 border-foreground ${plan.bg || 'bg-background'} p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border-4 border-foreground bg-[var(--color-landing-orange)] px-6 py-2 font-mono text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`font-mono text-2xl font-black uppercase tracking-wider ${plan.color}`}>{plan.name}</h3>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-mono text-5xl font-black tracking-tighter text-foreground">{plan.price}</span>
                  {plan.price !== 'Contact' && (
                    <span className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      / one-time
                    </span>
                  )}
                </div>
                <p className="mt-4 font-mono text-sm font-medium leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mb-10 flex-1">
                <ul className="flex flex-col gap-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-4 border-b-2 border-dotted border-muted py-2 font-mono text-sm font-bold uppercase tracking-tight text-foreground"
                    >
                      <div
                        className={`flex size-5 shrink-0 items-center justify-center rounded border-2 border-foreground bg-background ${plan.color}`}
                      >
                        <Check className="size-3" strokeWidth={4} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                asChild
                size="lg"
                className={`w-full font-mono text-lg font-black uppercase tracking-tighter h-16 border-4 border-foreground transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  plan.variant === 'default'
                    ? 'bg-foreground text-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-background text-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <Link href="/sign-in">{plan.buttonText}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center justify-center gap-6 rounded-2xl border-4 border-foreground bg-muted p-8 text-center md:flex-row md:justify-between md:text-left">
          <p className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Looking for a custom license or have questions?
          </p>
          <Link
            href="#"
            className="font-mono text-sm font-black uppercase tracking-widest text-foreground underline decoration-4 decoration-[var(--color-landing-orange)] underline-offset-8 hover:text-[var(--color-landing-orange)] transition-colors"
          >
            Contact our team →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
