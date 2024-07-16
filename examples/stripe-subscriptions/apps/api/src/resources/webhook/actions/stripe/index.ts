import Stripe from 'stripe';

import { stripeService } from 'services';

import config from 'config';

import { AppKoaContext, AppRouter, Next } from 'types';

import stripeHandler from './stripe-handler';

interface ValidatedData {
  event: Stripe.Event;
}

type SubscriptionUpdate = Stripe.Subscription & {
  plan: {
    id: string;
    product: string;
    interval: string;
  };
};
async function validator(ctx: AppKoaContext, next: Next) {
  const signature = ctx.request.header['stripe-signature'];

  ctx.assertError(signature, 'Stripe signature header is missing');

  try {
    const event = stripeService.webhooks.constructEvent(ctx.request.rawBody, signature, config.STRIPE_WEBHOOK_SECRET);

    ctx.validatedData = {
      event,
    };
  } catch (err) {
    ctx.throwError(`Webhook Error: ${err}`);
  }

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { event } = ctx.validatedData;

  let paymentMethod: Stripe.PaymentMethod;
  let setupIntent: Stripe.SetupIntent;

  switch (event.type) {
    case 'setup_intent.succeeded':
      setupIntent = event.data.object;

      await Promise.all([
        stripeHandler.updateCustomerDefaultPaymentMethod({
          customer: setupIntent.customer as string,
          paymentMethod: setupIntent.payment_method as string,
        }),
        stripeHandler.updateSubscriptionPaymentMethod({
          customer: setupIntent.customer as string,
          paymentMethod: setupIntent.payment_method as string,
        }),
      ]);
      break;

    case 'customer.subscription.created':
      await stripeHandler.updateUserSubscription(event.data.object as SubscriptionUpdate);
      break;

    case 'payment_method.attached':
      paymentMethod = event.data.object;
      await stripeHandler.updateCustomerDefaultPaymentMethod({
        customer: paymentMethod.customer as string,
        paymentMethod: paymentMethod.id as string,
      });
      break;

    case 'customer.subscription.updated':
      await stripeHandler.updateUserSubscription(event.data.object as SubscriptionUpdate);
      break;

    case 'customer.subscription.deleted':
      await stripeHandler.deleteUserSubscription(event.data.object);
      break;
    default:
      logger.info('Unhandled event type', event.type);
  }

  ctx.status = 200;
}

export default (router: AppRouter) => {
  router.post('/stripe', validator, handler);
};
