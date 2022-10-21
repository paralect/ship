import { z } from 'zod';

const schema = z.object({
  _id: z.string(),
  subscriptionId: z.string(),
  priceId: z.string(),
  productId: z.string(),
  customer: z.string(),
  status: z.string(),
  interval: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  cancelAtPeriodEnd: z.boolean(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
});

export default schema;
