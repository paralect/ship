import { z } from 'zod';

import { stripeService } from 'services';
import createEndpoint from 'routes/createEndpoint';

const schema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
});

export default createEndpoint({
  method: 'post',
  path: '/upgrade',
  schema,

  async handler(ctx) {
    const { user } = ctx.state;
    const { priceId } = ctx.validatedData;

    if (!user.stripeId) {
      return ctx.throwError('Stripe account not found. Please contact support.');
    }

    if (!user.subscription?.subscriptionId) {
      return ctx.throwError('No active subscription found.');
    }

    const subscriptionId = user.subscription.subscriptionId;

    if (priceId === 'free') {
      await stripeService.subscriptions.cancel(subscriptionId);
      return { success: true, message: 'Subscription canceled' };
    }

    const subscriptionDetails = await stripeService.subscriptions.retrieve(subscriptionId);

    await stripeService.subscriptions.update(subscriptionId, {
      proration_behavior: 'always_invoice',
      cancel_at_period_end: false,
      items: [
        {
          id: subscriptionDetails.items.data[0].id,
          price: priceId,
        },
      ],
    });

    return { success: true };
  },
});
