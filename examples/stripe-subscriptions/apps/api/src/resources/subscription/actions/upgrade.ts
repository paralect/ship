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

  ctx.assertError(user.stripeId, 'Customer does not have a stripe account');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { priceId } = ctx.validatedData;

  const subscriptionId = user.subscription?.subscriptionId as string;

  if (priceId === 'price_0') {
    await stripeService.subscriptions.deleteDiscount(subscriptionId, {
      prorate: true,
    });

    ctx.body = {};
    return;
  }

  const subscriptionDetails = await stripeService.subscriptions.retrieve(subscriptionId);

  const items = [
    {
      id: subscriptionDetails.items.data[0].id,
      price: priceId,
    },
  ];

  await stripeService.subscriptions.update(subscriptionId, {
    proration_behavior: 'always_invoice',
    cancel_at_period_end: false,
    items,
  });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/upgrade', validateMiddleware(schema), validator, handler);
};
