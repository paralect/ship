import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { Button } from './ui/button';
import { Card } from './ui/card';

import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: '$49',
    period: 'one-time',
    description: 'Perfect for side projects and MVPs',
    features: [
      'Single App License',
      'Next.js & Node.js API',
      'MongoDB Database',
      'Standard Email Support',
      'Lifetime Updates',
    ],
  },
  {
    name: 'Pro',
    price: '$99',
    period: 'one-time',
    description: 'Ideal for startups and teams',
    features: [
      'Unlimited App Licenses',
      'Stripe Integration',
      'Priority Slack Support',
      'Docker & CI/CD Setup',
      'Everything in Starter',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Contact',
    period: '',
    description: 'For teams needing high-touch support',
    features: [
      'White-glove Implementation',
      'Initial Audit & Setup',
      '24/7 Dedicated Support',
      'On-site Training',
      'Custom Extensions',
    ],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="bg-background @container scroll-mt-24 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance font-serif text-4xl font-medium">Straightforward Pricing</h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            No monthly fees. Pay once and build unlimited projects.
          </p>
        </div>
        <div className="@xl:grid-cols-3 mt-12 grid gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              variant={plan.highlighted ? 'default' : 'mixed'}
              className={cn('relative p-6', plan.highlighted && 'ring-primary')}
            >
              <div className="mb-6">
                <h3 className="text-foreground font-medium">{plan.name}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{plan.description}</p>
              </div>
              <div>
                <span className="font-serif text-5xl font-medium">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Check className="text-primary size-4" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button asChild variant={plan.highlighted ? 'default' : 'outline'} className="mt-8 w-full gap-2">
                <Link href="/sign-up">
                  Get Started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
        <p className="text-muted-foreground mt-8 text-center text-sm">
          All plans include lifetime updates and community support.
        </p>
      </div>
    </section>
  );
};
