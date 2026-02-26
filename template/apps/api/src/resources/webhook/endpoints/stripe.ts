import Stripe from 'stripe';

import { userService } from 'resources/users';

import isPublic from 'middlewares/isPublic';
import { stripeService } from 'services';
import createEndpoint from 'routes/createEndpoint';

import config from 'config';

import logger from 'logger';

interface SubscriptionEventData {
  id: string;
  customer: string;
  status: Stripe.Subscription.Status;
  cancel_at_period_end: boolean;
  cancel_at: number | null;
  current_period_start: number;
  current_period_end: number;
  plan: {
    id: string;
    product: string;
    interval: string;
  };
}

const updateUserSubscription = async (data: SubscriptionEventData) => {
  const isCanceled = data.cancel_at_period_end || data.cancel_at !== null;

  const subscription = {
    subscriptionId: data.id,
    priceId: data.plan.id,
    productId: data.plan?.product,
    status: data.status,
    interval: data.plan?.interval,
    currentPeriodStartDate: data.current_period_start,
    currentPeriodEndDate: data.current_period_end,
    cancelAtPeriodEnd: isCanceled,
  };

  return userService.atomic.updateOne({ stripeId: data.customer }, { $set: { subscription } });
};

const deleteUserSubscription = async (customerId: string) => {
  return userService.atomic.updateOne({ stripeId: customerId }, { $unset: { subscription: '' } });
};

export default createEndpoint({
  method: 'post' as const,
  path: '/stripe',
  middlewares: [isPublic],
  handler: async (ctx) => {
    const signature = ctx.request.header['stripe-signature'];

    if (!signature) {
      return ctx.throwError('Stripe signature header is missing');
    }

    if (!config.STRIPE_WEBHOOK_SECRET) {
      return ctx.throwError('Stripe webhook secret is not configured');
    }

    let event: Stripe.Event;

    try {
      event = stripeService.webhooks.constructEvent(
        (ctx.request as unknown as { rawBody: string }).rawBody,
        signature,
        config.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      return ctx.throwError(`Webhook signature verification failed: ${err}`);
    }

    switch (event.type) {
      case 'customer.subscription.created':
        await updateUserSubscription(event.data.object as unknown as SubscriptionEventData);
        logger.info(
          `Subscription created for customer ${(event.data.object as unknown as SubscriptionEventData).customer}`,
        );
        break;

      case 'customer.subscription.updated':
        await updateUserSubscription(event.data.object as unknown as SubscriptionEventData);
        logger.info(
          `Subscription updated for customer ${(event.data.object as unknown as SubscriptionEventData).customer}`,
        );
        break;

      case 'customer.subscription.deleted':
        await deleteUserSubscription((event.data.object as unknown as SubscriptionEventData).customer);
        logger.info(
          `Subscription deleted for customer ${(event.data.object as unknown as SubscriptionEventData).customer}`,
        );
        break;

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  },
});
