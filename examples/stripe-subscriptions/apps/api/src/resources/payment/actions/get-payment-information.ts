import _ from 'lodash';

import { AppKoaContext, AppRouter, Next } from 'types';

import { stripeService } from 'services';

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

  const paymentInformation: any = await stripeService.customers.retrieve(user.stripeId as string, {
    expand: ['invoice_settings.default_payment_method'],
  });

  if (!paymentInformation) {
    ctx.body = null;
    return;
  }

  const card = paymentInformation.invoice_settings.default_payment_method?.card;

  ctx.body = {
    balance: paymentInformation.balance,
    billingDetails: paymentInformation.invoice_settings.default_payment_method?.billing_details,
    card: card && _.pick(card, publicCardFields),
  };

  return;
}

export default (router: AppRouter) => {
  router.get('/payment-information', validator, handler);
};
