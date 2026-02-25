import { stripeService } from 'services';
import createEndpoint from 'routes/createEndpoint';

import config from 'config';

export default createEndpoint({
  method: 'post',
  path: '/create-portal-session',

  async handler(ctx) {
    const { user } = ctx.state;

    if (!user.stripeId) {
      return ctx.throwError('Stripe account not found. Please contact support.');
    }

    const session = await stripeService.billingPortal.sessions.create({
      customer: user.stripeId,
      return_url: `${config.WEB_URL}/pricing`,
    });

    return { portalUrl: session.url };
  },
});
