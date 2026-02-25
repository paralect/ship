import { z } from 'zod';

import { stripeService } from 'services';
import createEndpoint from 'routes/createEndpoint';

import config from 'config';

const schema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
});

export default createEndpoint({
  method: 'post',
  path: '/subscribe',
  schema,

  async handler(ctx) {
    const { user } = ctx.state;
    const { priceId } = ctx.validatedData;

    if (!user.stripeId) {
      return ctx.throwError('Stripe account not found. Please contact support.');
    }

    if (user.subscription) {
      return ctx.throwError('You already have an active subscription. Please upgrade instead.');
    }

    const session = await stripeService.checkout.sessions.create({
      mode: 'subscription',
      customer: user.stripeId,
      line_items: [
        {
          quantity: 1,
          price: priceId,
        },
      ],
      success_url: `${config.WEB_URL}/pricing?success=true`,
      cancel_url: `${config.WEB_URL}/pricing?canceled=true`,
    });

    if (!session.url) {
      return ctx.throwError('Unable to create checkout session');
    }

    return { checkoutUrl: session.url };
  },
});
