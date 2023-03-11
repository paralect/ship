import { z } from 'zod';

const schema = z.object({
  subscriptionId: z.string(),
  priceId: z.string(),
  productId: z.string(),
  status: z.string(),
  interval: z.string(),
  currentPeriodStartDate: z.date(),
  currentPeriodEndDate: z.date(),
  cancelAtPeriodEnd: z.boolean(),
});

export default schema;
