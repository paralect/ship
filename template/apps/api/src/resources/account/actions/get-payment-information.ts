import _ from 'lodash';

import { AppKoaContext, AppRouter } from 'types';

import stripe from 'services/stripe/stripe.service';

const publicCardFields = ['brand', 'exp_month', 'exp_year', 'last4'];

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  if (user.stripeId) {
    // TODO: Check what info will be stored in
    // those fields when customer updates his card
    // using our application
    const paymentInformation: any = await stripe.customers.retrieve(user.stripeId, {
      expand: ['invoice_settings.default_payment_method', 'default_source'],
    });

    ctx.body = {
      balance: paymentInformation.balance,
      billingDetails: paymentInformation.invoice_settings.default_payment_method.billing_details,
      card: _.pick(paymentInformation.invoice_settings.default_payment_method.card, publicCardFields),
    };

    return;
  }

  ctx.body = null;
}

export default (router: AppRouter) => {
  router.get('/payment-information', handler);
};
