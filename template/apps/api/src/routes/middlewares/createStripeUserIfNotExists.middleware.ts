import { AppKoaContext, Next } from 'types';
import logger from 'logger';

import stripe from 'services/stripe/stripe.service';
import { userService } from 'resources/user';

async function createStripeUserIfNotExists(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;

  if (user && !user.stripeId) {
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName,
      });
    
      await userService.atomic.updateOne(
        { _id: user._id },
        {
          $set: {
            stripeId: customer.id,
          },
        },
      );
    } catch (error) {
      logger.error(`Error crating stripe account for ${user._id}`, error);
    }
  }

  return next();
}

export default createStripeUserIfNotExists;
