import config from 'config';

import Stripe from 'stripe';

const stripe = new Stripe(config.STRIPE_API_KEY, { typescript: true, apiVersion: '2022-08-01' });

export default stripe;
