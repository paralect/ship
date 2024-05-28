import { Intervals } from 'app-types';

import config from 'config';

export const items = [
  {
    priceId: {
      month: 'price_0',
      year: 'price_0',
    },
    title: 'Basic',
    price: {
      [Intervals.MONTH]: 0,
      [Intervals.YEAR]: 0,
    },
    features: ['Onboarding', 'Unlimited Growthflags', 'Unlimited A/B tests', 'Up to 3 product users', 'Up to 2K MAU'],
  },
  {
    priceId: {
      month: config.SUBSCRIPTION_STARTER_MONTH,
      year: config.SUBSCRIPTION_STARTER_YEAR,
    },
    title: 'Starter',
    price: {
      [Intervals.MONTH]: 45,
      [Intervals.YEAR]: 459,
    },
    features: ['Onboarding', 'Unlimited Growthflags', 'Unlimited A/B tests', 'Up to 10 product users', 'Up to 10K MAU'],
  },
  {
    priceId: {
      month: config.SUBSCRIPTION_PRO_MONTH,
      year: config.SUBSCRIPTION_PRO_YEAR,
    },
    title: 'Pro',
    price: {
      [Intervals.MONTH]: 99,
      [Intervals.YEAR]: 1010,
    },
    features: [
      'Onboarding',
      'Unlimited Growthflags',
      'Unlimited A/B tests',
      'Unlimited product users',
      'Up to 100K MAU',
    ],
  },
];
