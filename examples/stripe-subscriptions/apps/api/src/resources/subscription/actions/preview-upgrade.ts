import { z } from 'zod';

import { validateMiddleware } from 'middlewares';
import { stripeService } from 'services';

import { AppKoaContext, AppRouter, Next } from 'types';

const schema = z.object({
  priceId: z.string().min(1, 'Price id is required').startsWith('price_', 'Incorrect price id'),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;

  ctx.assertClientError(user.subscription, { global: 'Subscription does not exist' }, 400);

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { priceId } = ctx.validatedData;

  const subscriptionDetails = await stripeService.subscriptions.retrieve(user.subscription?.subscriptionId as string);

  let items: object[];

  if (priceId === 'price_0') {
    items = [
      {
        id: subscriptionDetails.items.data[0].id,
        price_data: {
          currency: 'USD',
          product: user.subscription?.productId,
          recurring: {
            interval: subscriptionDetails.items.data[0].price.recurring?.interval,
            interval_count: 1,
          },
          unit_amount: 0,
        },
      },
    ];
  } else {
    items = [
      {
        id: subscriptionDetails.items.data[0].id,
        price: priceId,
      },
    ];
  }

  const invoice = await stripeService.invoices.retrieveUpcoming({
    customer: user.stripeId || undefined,
    subscription: user.subscription?.subscriptionId,
    subscription_items: items,
    subscription_proration_behavior: 'always_invoice',
  });

  ctx.body = { invoice };
}

export default (router: AppRouter) => {
  router.get('/preview-upgrade', validateMiddleware(schema), validator, handler);
};
