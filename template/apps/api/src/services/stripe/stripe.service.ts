import { ClientSession } from '@paralect/node-mongo';
import Stripe from 'stripe';

import { userService } from 'resources/users';
import type { User } from 'resources/users/user.schema';

import config from 'config';

import logger from 'logger';

const stripe = config.STRIPE_SECRET_KEY ? new Stripe(config.STRIPE_SECRET_KEY) : null;

const createCustomer = async (user: User, session?: ClientSession): Promise<string | null> => {
  if (!stripe) {
    logger.warn('[Stripe] Service not initialized - STRIPE_SECRET_KEY not provided');
    return null;
  }

  try {
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
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

    logger.info(`[Stripe] Created customer ${customer.id} for user ${user._id}`);

    return customer.id;
  } catch (error) {
    logger.error(`[Stripe] Error creating customer for user ${user._id}`, error);
    throw error;
  }
};

const getStripe = () => {
  if (!stripe) {
    throw new Error('[Stripe] Service not initialized - STRIPE_SECRET_KEY not provided');
  }
  return stripe;
};

export default {
  createCustomer,
  getStripe,
  get subscriptions() {
    return getStripe().subscriptions;
  },
  get customers() {
    return getStripe().customers;
  },
  get checkout() {
    return getStripe().checkout;
  },
  get billingPortal() {
    return getStripe().billingPortal;
  },
  get products() {
    return getStripe().products;
  },
  get invoices() {
    return getStripe().invoices;
  },
  get setupIntents() {
    return getStripe().setupIntents;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};
