import config from 'config';

export interface Plan {
  name: string;
  price: string;
  priceId: string | null;
  description: string;
  features: string[];
  current?: boolean;
  popular?: boolean;
}

export const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    priceId: null,
    description: 'For individuals getting started',
    features: ['Basic features', 'Limited usage', 'Community support'],
    current: true,
  },
  {
    name: 'Creator',
    price: '$29',
    priceId: config.PRICE_CREATOR ?? null,
    description: 'For growing creators',
    features: ['All Free features', 'Advanced features', 'Priority support', 'Higher limits'],
    popular: true,
  },
  {
    name: 'Pro',
    price: '$49',
    priceId: config.PRICE_PRO ?? null,
    description: 'For professionals and teams',
    features: ['All Creator features', 'Unlimited usage', 'Premium support', 'Custom integrations'],
  },
];
