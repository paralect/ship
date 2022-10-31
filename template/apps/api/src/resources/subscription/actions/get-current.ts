import { AppKoaContext, AppRouter } from 'types';

import stripe from 'services/stripe/stripe.service';

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  if (user.subscription) {
    const product = await stripe.products.retrieve(user.subscription.productId);
    const pendingInvoice = await stripe.invoices.retrieveUpcoming({
      subscription: user.subscription?.subscriptionId,
    });

    ctx.body = {
      ...user.subscription,
      product,
      pendingInvoice: {
        subtotal: pendingInvoice.subtotal,
        tax: pendingInvoice.tax,
        total: pendingInvoice.total,
        amountDue: pendingInvoice.amount_due,
        status: pendingInvoice.status,
      },
    };

    return;
  }

  ctx.body = null;
}

export default (router: AppRouter) => {
  router.get('/current', handler);
};
