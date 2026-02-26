import Stripe from 'stripe';
import { z } from 'zod';

import { userService } from 'resources/users';

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
      await userService.atomic.updateOne({ _id: user._id }, { $unset: { subscription: '' } });
      return { success: true, message: 'Subscription canceled' };
    }

    const subscriptionDetails = (await stripeService.subscriptions.retrieve(subscriptionId)) as Stripe.Subscription;

    const updatedStripeSubscription = (await stripeService.subscriptions.update(subscriptionId, {
      proration_behavior: 'always_invoice',
      cancel_at_period_end: false,
      items: [
        {
          id: subscriptionDetails.items.data[0].id,
          price: priceId,
        },
      ],
    })) as Stripe.Subscription;

    const updatedSubscription = {
      ...user.subscription,
      priceId: updatedStripeSubscription.items.data[0]?.price.id ?? priceId,
      productId: updatedStripeSubscription.items.data[0]?.price.product as string,
      status: updatedStripeSubscription.status,
      cancelAtPeriodEnd: updatedStripeSubscription.cancel_at_period_end,
      currentPeriodStartDate: (updatedStripeSubscription as unknown as { current_period_start: number })
        .current_period_start,
      currentPeriodEndDate: (updatedStripeSubscription as unknown as { current_period_end: number }).current_period_end,
    };

    await userService.atomic.updateOne({ _id: user._id }, { $set: { subscription: updatedSubscription } });

    return { success: true };
  },
});
