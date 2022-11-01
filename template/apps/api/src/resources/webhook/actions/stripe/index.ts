import config from 'config';
import Stripe from 'stripe';
import { AppKoaContext, AppRouter, Next } from 'types';

import { stripeService } from 'services';
import { userService } from 'resources/user';

import stripeHandler from './stripe-handler';

interface ValidatedData {
  event: Stripe.Event;
}

async function validator(ctx: AppKoaContext, next: Next) {
  const signature = ctx.request.header['stripe-signature'];

  ctx.assertClientError(signature, { signature: 'Stripe signature header is missing' }, 403);

  try {
    const event = stripeService.webhooks.constructEvent(ctx.request.rawBody, signature, config.stripe.webhookSecret);

    ctx.validatedData = {
      event,
    };
  } catch (err: any) {
    ctx.status = 400;
    ctx.message = `Webhook Error: ${err.message}`;
    return null;
  }

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { event } = ctx.validatedData;

  switch (event.type) {
    case 'setup_intent.succeeded':
      const setupIntent = event.data.object as Stripe.SetupIntent;
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
      return;

    case 'payment_method.attached':
      const paymentMethod = event.data.object as Stripe.PaymentMethod;
      await stripeHandler.updateCustomerDefaultPaymentMethod({
        customer: paymentMethod.customer as string,
        paymentMethod: paymentMethod.id as string,
      });
      return;

    case 'customer.subscription.updated':
      await stripeHandler.updateUserSubscription(event.data.object);
      return;

    case 'customer.subscription.deleted':
      await stripeHandler.deleteUserSubscription(event.data.object);
  }

  ctx.status = 200;
}

export default (router: AppRouter) => {
  router.post('/stripe', validator, handler);
};
