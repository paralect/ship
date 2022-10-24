import config from 'config';

import { subscriptionConstants } from 'resources/subscription';

export type SubscriptionItemType = {
  priceId: Record<subscriptionConstants.Intervals, string>,
  title: string,
  price: Record<subscriptionConstants.Intervals, number>,
  features: string[],
};

export const subscriptionItems: SubscriptionItemType[] = [
  {
    priceId: {
      month: 'price_0',
      year: 'price_0',
    },
    title: 'Basic',
    price: {
      [subscriptionConstants.Intervals.Month]: 0,
      [subscriptionConstants.Intervals.Year]: 0,
    },
    features: [
      'Onboarding',
      'Unlimited Growthflags',
      'Unlimited A/B tests',
      '**Up to 3** product users',
      '**Up to 2K** MAU',
    ],
  },
  {
    priceId: {
      month: config.subscriptions.starter.month,
      year: config.subscriptions.starter.year,
    },
    title: 'Starter',
    price: {
      [subscriptionConstants.Intervals.Month]: 45,
      [subscriptionConstants.Intervals.Year]: 459,
    },
    features: [
      'Onboarding',
      'Unlimited Growthflags',
      'Unlimited A/B tests',
      '**Up to 10** product users',
      '**Up to 10K** MAU',
    ],
  },
  {
    priceId: {
      month: config.subscriptions.pro.month,
      year: config.subscriptions.pro.year,
    },
    title: 'Pro',
    price: {
      [subscriptionConstants.Intervals.Month]: 99,
      [subscriptionConstants.Intervals.Year]: 1010,
    },
    features: [
      'Onboarding',
      'Unlimited Growthflags',
      'Unlimited A/B tests',
      '**Unlimited** product users',
      '**Up to 100K** MAU',
    ],
  },
];
