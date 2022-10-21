import stripe from 'services/stripe/stripe.service';

import { subscriptionService } from 'resources/subscription';

import { AppKoaContext, AppRouter } from 'types';

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  const currentSubscription = await subscriptionService.findOne({ customer: user.stripeId || undefined });

  if (!currentSubscription) {
    ctx.status = 400;
    ctx.message = 'Subscription does not exist';

    return;
  }

  await stripe.subscriptions.update(currentSubscription.subscriptionId, {
    cancel_at_period_end: true,
  });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/cancel-subscription', handler);
};
