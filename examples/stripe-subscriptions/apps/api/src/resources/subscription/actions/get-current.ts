import { stripeService } from 'services';

import { AppKoaContext, AppRouter, Next } from 'types';

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;

  if (!user.subscription) {
    ctx.body = null;

    return;
  }

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  const product = await stripeService.products.retrieve(user.subscription?.productId as string);

  const pendingInvoice = await stripeService.invoices.retrieveUpcoming({
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
}

export default (router: AppRouter) => {
  router.get('/current', validator, handler);
};
