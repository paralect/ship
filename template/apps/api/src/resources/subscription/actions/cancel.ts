import { stripeService } from 'services';

import { AppKoaContext, AppRouter } from 'types';

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  if (!user.subscription) {
    ctx.status = 400;
    ctx.message = 'Subscription does not exist';

    return;
  }

  await stripeService.subscriptions.update(user.subscription.subscriptionId, {
    cancel_at_period_end: true,
  });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/cancel-subscription', handler);
};
