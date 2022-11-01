import config from 'config';
import { stripeService } from 'services';
import handleStripeWebhook from 'services/stripe/stripe.webhook';

import { AppKoaContext, AppRouter } from 'types';

async function handler(ctx: AppKoaContext) {
  const signature = ctx.request.header['stripe-signature'];

  if (!signature) {
    ctx.status = 403;
    return null;
  }

  let event;

  try {
    event = stripeService.webhooks.constructEvent(ctx.request.rawBody, signature, config.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    ctx.status = 400;
    ctx.message = `Webhook Error: ${err.message}`;
    return null;
  }

  await handleStripeWebhook(event);

  ctx.status = 200;
}

export default (router: AppRouter) => {
  router.post('/stripe', handler);
};
