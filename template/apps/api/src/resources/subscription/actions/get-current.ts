import { AppKoaContext, AppRouter } from 'types';

import stripe from 'services/stripe/stripe.service';
import { subscriptionService } from 'resources/subscription';

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  if (user.stripeId) {
    const subscription = await subscriptionService.findOne({ customer: user.stripeId });

    const product = await stripe.products.retrieve(subscription?.productId as string);
    const pendingInvoice = await stripe.invoices.retrieveUpcoming({
      subscription: subscription?.subscriptionId as string,
    });

    ctx.body = {
      ...subscription,
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
