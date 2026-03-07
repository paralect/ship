import Link from 'next/link';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out Ship and exploring its features.',
    features: ['Up to 3 projects', 'Basic analytics', 'Community support', 'API access'],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing businesses that need more power and flexibility.',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Custom integrations',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom needs and requirements.',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom contracts',
      'SLA guarantee',
      'On-premise deployment',
      'Advanced security',
    ],
    cta: 'Contact Sales',
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="relative overflow-hidden py-12 sm:py-16">
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/8 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-emerald-500/6 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that works best for you. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="group relative">
              {plan.popular && (
                <>
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500 opacity-50 blur-sm transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500 opacity-75" />
                </>
              )}

              <div
                className={cn(
                  'relative flex h-full flex-col rounded-2xl p-8',
                  plan.popular ? 'bg-background' : 'border border-border/50 bg-card',
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-6">
                    <span className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-medium text-black">Popular</span>
                  </div>
                )}

                <div>
                  <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {plan.name}
                  </span>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <Button
                  asChild
                  variant={plan.popular ? 'default' : 'outline'}
                  className={cn(
                    'mt-6 w-full',
                    plan.popular ? 'bg-cyan-500 text-black hover:bg-cyan-400' : 'border-border/50 hover:bg-muted',
                  )}
                >
                  <Link href="/sign-up">{plan.cta}</Link>
                </Button>

                <div className="mt-6 border-t border-border/50 pt-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div
                          className={cn(
                            'flex size-5 items-center justify-center rounded-full',
                            plan.popular ? 'bg-cyan-500/20' : 'bg-muted',
                          )}
                        >
                          <Check className={cn('size-3', plan.popular ? 'text-cyan-500' : 'text-muted-foreground')} />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
