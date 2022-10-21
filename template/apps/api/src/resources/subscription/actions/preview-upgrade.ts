import { z } from 'zod';
import stripe from 'services/stripe/stripe.service';

import { subscriptionService } from 'resources/subscription';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

const schema = z.object({
  priceId: z.string()
    .min(1, 'Price id is required')
    .startsWith('price_', 'Incorrect price id'),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { priceId } = ctx.validatedData;

  const currentSubscription = await subscriptionService.findOne({ customer: user.stripeId || undefined });

  if (!currentSubscription) {
    ctx.status = 400;
    ctx.message = 'Subscription does not exist';

    return;
  }

  const subscriptionDetails = await stripe.subscriptions.retrieve(currentSubscription.subscriptionId);

  let items: any;

  if (priceId === 'price_0') {
    items = [{
      id: subscriptionDetails.items.data[0].id,
      price_data: {
        currency: 'USD',
        product: currentSubscription.productId,
        recurring: {
          interval: subscriptionDetails.items.data[0].price.recurring?.interval,
          interval_count: 1,
        },
        unit_amount: 0,
      },
    }];
  } else {
    items = [{
      id: subscriptionDetails.items.data[0].id,
      price: priceId,
    }];
  }

  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: user.stripeId || undefined,
    subscription: currentSubscription.subscriptionId,
    subscription_items: items,
    subscription_proration_behavior: 'always_invoice',
  });

  ctx.body = { invoice };
}

export default (router: AppRouter) => {
  router.get('/preview-upgrade', validateMiddleware(schema), handler);
};
