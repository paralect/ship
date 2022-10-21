import { AppKoaContext, AppRouter } from 'types';
import { subscriptionService } from 'resources/subscription';

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  if (user.stripeId) {
    const subscription = await subscriptionService.findOne({ customer: user.stripeId });
    ctx.body = subscription;

    return;
  }

  ctx.body = null;
}

export default (router: AppRouter) => {
  router.get('/current', handler);
};
