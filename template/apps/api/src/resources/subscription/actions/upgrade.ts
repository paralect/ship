import { z } from 'zod';
import stripe from 'services/stripe/stripe.service';

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

  if (!user.subscription) {
    ctx.status = 400;
    ctx.message = 'Subscription does not exist';

    return;
  }

  if (priceId === 'price_0') {
    await stripe.subscriptions.del(user.subscription.subscriptionId, {
      prorate: true,
    });

    ctx.body = {};
    return;
  }

  const subscriptionDetails = await stripe.subscriptions.retrieve(user.subscription.subscriptionId);

  const items = [{
    id: subscriptionDetails.items.data[0].id,
    price: priceId,
  }];

  await stripe.subscriptions.update(user.subscription.subscriptionId, {
    proration_behavior: 'always_invoice',
    cancel_at_period_end: false,
    items,
  });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/upgrade', validateMiddleware(schema), handler);
};
