import _ from 'lodash';
import Stripe from 'stripe';

import { stripeService } from 'services';

import { AppKoaContext, AppRouter, Next } from 'types';

const publicCardFields = ['brand', 'exp_month', 'exp_year', 'last4'];

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;

  if (!user.stripeId) {
    ctx.body = null;
    return;
  }

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  const paymentInformation: Stripe.Customer | Stripe.DeletedCustomer = await stripeService.customers.retrieve(
    user.stripeId as string,
    {
      expand: ['invoice_settings.default_payment_method'],
    },
  );

  if (!paymentInformation) {
    ctx.body = null;
    return;
  }

  if ('invoice_settings' in paymentInformation && paymentInformation.invoice_settings) {
    const paymentMethod = paymentInformation.invoice_settings.default_payment_method as
      | Stripe.PaymentMethod
      | undefined;

    const card = paymentMethod?.card;

    const billingDetails = paymentMethod?.billing_details;

    ctx.body = {
      balance: paymentInformation.balance,
      billingDetails,
      card: card && _.pick(card, publicCardFields),
    };
  }
}

export default (router: AppRouter) => {
  router.get('/payment-information', validator, handler);
};
