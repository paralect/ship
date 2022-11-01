import config from 'config';
import { z } from 'zod';
import { stripeService } from 'services';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

const schema = z.object({
  priceId: z.string()
    .min(1, 'Price id is required'),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { priceId } = ctx.validatedData;

  const session = await stripeService.checkout.sessions.create({
    mode: 'subscription',
    customer: user.stripeId || undefined,
    customer_email: user.stripeId ? undefined : user.email,
    line_items: [{
      quantity: 1,
      price: priceId,
    }],
    success_url: `${config.webUrl}?subscriptionPlan=${priceId}`,
    cancel_url: config.webUrl,
  });

  if (!session.url) {
    ctx.status = 503;

    return null;
  }

  ctx.body = { checkoutLink: session.url };
}

export default (router: AppRouter) => {
  router.post('/subscribe', validateMiddleware(schema), handler);
};
