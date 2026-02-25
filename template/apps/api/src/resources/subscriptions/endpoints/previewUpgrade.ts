import { z } from 'zod';

import { stripeService } from 'services';
import createEndpoint from 'routes/createEndpoint';

const schema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
});

export default createEndpoint({
  method: 'get',
  path: '/preview-upgrade',
  schema,

  async handler(ctx) {
    const { user } = ctx.state;
    const { priceId } = ctx.validatedData;

    if (!user.stripeId) {
      return ctx.throwError('Stripe account not found.');
    }

    if (!user.subscription?.subscriptionId) {
      return ctx.throwError('No active subscription found.');
    }

    const subscriptionId = user.subscription.subscriptionId;
    const subscriptionDetails = await stripeService.subscriptions.retrieve(subscriptionId);

    const invoice = await stripeService.invoices.createPreview({
      customer: user.stripeId,
      subscription: subscriptionId,
      subscription_details: {
        proration_behavior: 'always_invoice',
        items: [
          {
            id: subscriptionDetails.items.data[0].id,
            price: priceId,
          },
        ],
      },
    });

    return {
      subtotal: invoice.subtotal,
      total: invoice.total,
      amountDue: invoice.amount_due,
      currency: invoice.currency,
    };
  },
});
