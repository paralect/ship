import config from 'config';

import { Intervals, ItemType } from './subscription.types';

export const items: ItemType[] = [
  {
    priceId: {
      month: 'price_0',
      year: 'price_0',
    },
    title: 'Basic',
    price: {
      [Intervals.Month]: 0,
      [Intervals.Year]: 0,
    },
    features: [
      'Onboarding',
      'Unlimited Growthflags',
      'Unlimited A/B tests',
      'Up to 3 product users',
      'Up to 2K MAU',
    ],
  },
  {
    priceId: {
      month: config.subscriptions.starter.month,
      year: config.subscriptions.starter.year,
    },
    title: 'Starter',
    price: {
      [Intervals.Month]: 45,
      [Intervals.Year]: 459,
    },
    features: [
      'Onboarding',
      'Unlimited Growthflags',
      'Unlimited A/B tests',
      'Up to 10 product users',
      'Up to 10K MAU',
    ],
  },
  {
    priceId: {
      month: config.subscriptions.pro.month,
      year: config.subscriptions.pro.year,
    },
    title: 'Pro',
    price: {
      [Intervals.Month]: 99,
      [Intervals.Year]: 1010,
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
