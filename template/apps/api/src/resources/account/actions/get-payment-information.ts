import _ from 'lodash';

import { AppKoaContext, AppRouter } from 'types';

import stripe from 'services/stripe/stripe.service';

const publicCardFields = ['brand', 'exp_month', 'exp_year', 'last4'];

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  if (user.stripeId) {
    const paymentInformation: any = await stripe.customers.retrieve(user.stripeId, {
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

  ctx.body = null;
}

export default (router: AppRouter) => {
  router.get('/payment-information', handler);
};
