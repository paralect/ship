import logger from 'logger';
import stripe from 'services/stripe/stripe.service';

type PaymentMethodType = {
  customer: string,
  paymentMethod: string,
};

const updateDefaultPaymentMethod = async (data: PaymentMethodType) => {
  try {
    await stripe.customers.update(data.customer, {
      invoice_settings: {
        default_payment_method: data.paymentMethod,
      },
    });
  } catch (error) {
    logger.error(`Error updating customer ${data.customer} default payment method`, error);
  }
};

export default {
  updateDefaultPaymentMethod,
};
