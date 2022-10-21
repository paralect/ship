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
      '<span>Onboarding</span>',
      '<span>Unlimited Growthflags</span>',
      '<span>Unlimited A/B tests</span>',
      '<span><b>Up to 3</b> product users</span>',
      '<span><b>Up to 2K</b> MAU</span>',
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
      '<span>Onboarding</span>',
      '<span>Unlimited Growthflags</span>',
      '<span>Unlimited A/B tests</span>',
      '<span><b>Up to 10</b> product users</span>',
      '<span><b>Up to 10K</b> MAU</span>',
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
      '<span>Onboarding</span>',
      '<span>Unlimited Growthflags</span>',
      '<span>Unlimited A/B tests</span>',
      '<span><b>Unlimited</b> product users</span>',
      '<span><b>Up to 100K</b> MAU</span>',
    ],
  },
];
