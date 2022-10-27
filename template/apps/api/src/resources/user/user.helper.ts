import logger from 'logger';
import stripe from 'services/stripe/stripe.service';

const updateDefaultPaymentMethod = async (data: any) => {
  try {
    await stripe.customers.update(data.customer, {
      invoice_settings: {
        default_payment_method: data.payment_method,
      },
    });
  } catch (error) {
    logger.error(`Error updating customer ${data.customer} default payment method`, error);
  }
};

export default {
  updateDefaultPaymentMethod,
};
