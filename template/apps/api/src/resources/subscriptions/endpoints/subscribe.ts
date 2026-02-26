import { z } from 'zod';

import { userService } from 'resources/users';

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

    let stripeId = user.stripeId;
    if (!stripeId) {
      const customer = await stripeService.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
        metadata: { userId: user._id },
      });
      stripeId = customer.id;
      await userService.atomic.updateOne({ _id: user._id }, { $set: { stripeId } });
    }

    if (user.subscription) {
      return ctx.throwError('You already have an active subscription. Please upgrade instead.');
    }

    const session = await stripeService.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeId,
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
