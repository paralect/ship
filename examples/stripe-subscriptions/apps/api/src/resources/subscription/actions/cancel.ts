import { stripeService } from 'services';

import { AppKoaContext, AppRouter, Next } from 'types';

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;

  ctx.assertClientError(user.subscription, { global: 'Subscription does not exist' }, 400);

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  await stripeService.subscriptions.update(user.subscription?.subscriptionId as string, {
    cancel_at_period_end: true,
  });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/cancel-subscription', validator, handler);
};
