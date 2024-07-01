import { stripeService } from 'services';

import { AppKoaContext, AppRouter, Next } from 'types';

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;

  ctx.assertError(user.stripeId, 'Customer does not have a stripe account');

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  const setupIntent = await stripeService.setupIntents.create({
    customer: user.stripeId || undefined,
    payment_method_types: ['card'],
  });

  ctx.body = { clientSecret: setupIntent.client_secret };
}

export default (router: AppRouter) => {
  router.post('/create-setup-intent', validator, handler);
};
