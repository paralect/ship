import config from 'config';

import Stripe from 'stripe';
import logger from 'logger';

import { userService } from 'resources/user';
import type { User } from 'resources/user';

const stripe = new Stripe(config.STRIPE_API_KEY, { typescript: true, apiVersion: '2022-08-01' });

const createAndAttachStripeAccount = async (user: User): Promise<void> => {
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
    logger.error(`Error creating stripe account for user ${user._id}`, error);
  }
};

export default Object.assign({}, {
  ...stripe,
  createAndAttachStripeAccount,
});
