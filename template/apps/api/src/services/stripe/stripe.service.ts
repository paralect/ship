import config from 'config';

import Stripe from 'stripe';
import logger from 'logger';

import { userService } from 'resources/user';
import type { User } from 'resources/user';
import type { ClientSession } from '@paralect/node-mongo';

const stripe = new Stripe(config.stripe.apiKey, { typescript: true, apiVersion: '2022-08-01' });

const createAndAttachStripeAccount = async (user: User, session?: ClientSession): Promise<void> => {
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
