import { stripeService } from 'services';
import createEndpoint from 'routes/createEndpoint';

export default createEndpoint({
  method: 'get',
  path: '/current',

  async handler(ctx) {
    const { user } = ctx.state;

    if (!user.subscription) {
      return null;
    }

    const product = await stripeService.products.retrieve(user.subscription.productId);

    let pendingInvoice = null;
    try {
      const invoice = await stripeService.invoices.createPreview({
        subscription: user.subscription.subscriptionId,
      });
      pendingInvoice = {
        subtotal: invoice.subtotal,
        total: invoice.total,
        amountDue: invoice.amount_due,
        status: invoice.status || 'draft',
        created: invoice.created,
      };
    } catch {
      // No upcoming invoice (subscription may be canceled)
    }

    return {
      ...user.subscription,
      product: {
        name: product.name,
        images: product.images,
      },
      pendingInvoice,
    };
  },
});
