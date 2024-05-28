import { z } from 'zod';

export const subscriptionSchema = z.object({
  subscriptionId: z.string(),
  priceId: z.string(),
  productId: z.string(),
  status: z.string(),
  interval: z.string(),
  currentPeriodStartDate: z.number(),
  currentPeriodEndDate: z.number(),
  cancelAtPeriodEnd: z.boolean(),
  product: z
    .object({
      name: z.string(),
      images: z.array(z.string()),
    })
    .optional(),
  pendingInvoice: z
    .object({
      subtotal: z.number(),
      tax: z.number().nullable().optional(),
      total: z.number(),
      amountDue: z.number(),
      status: z.string(),
      created: z.number(),
    })
    .optional(),
});
