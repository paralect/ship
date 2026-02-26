import { stripeService } from 'services';
import createEndpoint from 'routes/createEndpoint';

import config from 'config';

export default createEndpoint({
  method: 'post',
  path: '/create-portal-session',

  async handler(ctx) {
    const { user } = ctx.state;

    const stripeId = user.stripeId || (await stripeService.createCustomer(user));

    if (!stripeId) {
      return ctx.throwError('Failed to create Stripe customer');
    }

    const session = await stripeService.billingPortal.sessions.create({
      customer: stripeId,
      return_url: `${config.WEB_URL}/pricing?portal=true`,
    });

    return { portalUrl: session.url };
  },
});
