import { userService } from 'resources/users';

import { stripeService } from 'services';
import createEndpoint from 'routes/createEndpoint';

import config from 'config';

export default createEndpoint({
  method: 'post',
  path: '/create-portal-session',

  async handler(ctx) {
    const { user } = ctx.state;

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

    const session = await stripeService.billingPortal.sessions.create({
      customer: stripeId,
      return_url: `${config.WEB_URL}/pricing?portal=true`,
    });

    return { portalUrl: session.url };
  },
});
