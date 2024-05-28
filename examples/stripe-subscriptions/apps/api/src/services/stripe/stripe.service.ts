import { ClientSession } from '@paralect/node-mongo';
import { User } from 'app-types';
import Stripe from 'stripe';

import { userService } from 'resources/user';

import config from 'config';

import logger from 'logger';

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

const createAndAttachStripeAccount = async (user: User, session?: ClientSession): Promise<void | null> => {
  try {
    if (!config.STRIPE_SECRET_KEY) {
      logger.error('[Stripe] API key is not provided');
    }

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
      {},
      { session },
    );
  } catch (error) {
    logger.error(`Error creating stripe account for user ${user._id}`, error);
    throw error;
  }
};

export default {
  ...stripe,
  createAndAttachStripeAccount,
};
