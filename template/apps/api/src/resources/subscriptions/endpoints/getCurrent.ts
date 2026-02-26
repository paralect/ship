import Stripe from 'stripe';

import { userService } from 'resources/users';

import { stripeService } from 'services';
import createEndpoint from 'routes/createEndpoint';

export default createEndpoint({
  method: 'get',
  path: '/current',

  async handler(ctx) {
    const { user } = ctx.state;

    if (!user.subscription) {
      return null;
    }

    const stripeSubscription = (await stripeService.subscriptions.retrieve(
      user.subscription.subscriptionId,
    )) as Stripe.Subscription;

    if (stripeSubscription.status === 'canceled') {
      await userService.atomic.updateOne({ _id: user._id }, { $unset: { subscription: '' } });
      return null;
    }

    const isCanceled = stripeSubscription.cancel_at_period_end || stripeSubscription.cancel_at !== null;

    const stripePeriodEnd =
      stripeSubscription.cancel_at ??
      (stripeSubscription as unknown as { current_period_end: number }).current_period_end;

    const needsUpdate =
      user.subscription.cancelAtPeriodEnd !== isCanceled ||
      user.subscription.status !== stripeSubscription.status ||
      user.subscription.priceId !== (stripeSubscription.items.data[0]?.price.id ?? user.subscription.priceId) ||
      user.subscription.currentPeriodEndDate !== stripePeriodEnd;

    if (needsUpdate) {
      const updatedSubscription = {
        ...user.subscription,
        priceId: stripeSubscription.items.data[0]?.price.id ?? user.subscription.priceId,
        cancelAtPeriodEnd: isCanceled,
        status: stripeSubscription.status,
        currentPeriodStartDate: (stripeSubscription as unknown as { current_period_start: number })
          .current_period_start,
        currentPeriodEndDate: stripePeriodEnd,
      };

      await userService.atomic.updateOne({ _id: user._id }, { $set: { subscription: updatedSubscription } });
      user.subscription = updatedSubscription;
    }

    const product = await stripeService.products.retrieve(user.subscription.productId);

    let pendingInvoice = null;
    try {
      const invoice = await stripeService.invoices.createPreview({
        subscription: user.subscription.subscriptionId,
      });
      pendingInvoice = {
        subtotal: invoice.subtotal,
        total: invoice.total,
        amountDue: invoice.amount_due,
        status: invoice.status || 'draft',
        created: invoice.created,
      };
    } catch {
      // No upcoming invoice (subscription may be canceled)
    }

    const result = {
      ...user.subscription,
      product: {
        name: product.name,
        images: product.images,
      },
      pendingInvoice,
    };

    return result;
  },
});
