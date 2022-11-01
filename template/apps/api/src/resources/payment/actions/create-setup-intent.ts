import { stripeService } from 'services';

import { AppKoaContext, AppRouter } from 'types';

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  if (!user.stripeId) {
    // TODO: Create stripe user during registration?

    ctx.status = 400;
    ctx.message = 'Customer does not have stripe account';

    return;
  }

  const setupIntent = await stripeService.setupIntents.create({
    customer: user.stripeId,
    payment_method_types: ['card'],
  });

  ctx.body = { clientSecret: setupIntent.client_secret };
}

export default (router: AppRouter) => {
  router.post('/create-setup-intent', handler);
};
