import { z } from 'zod';

import { subscriptionSchema } from 'schemas';

export enum Intervals {
  MONTH = 'month',
  YEAR = 'year',
}

export type ItemType = {
  priceId: Record<Intervals, string>;
  title: string;
  price: Record<Intervals, number>;
  features: string[];
};

export type Subscription = z.infer<typeof subscriptionSchema>;
