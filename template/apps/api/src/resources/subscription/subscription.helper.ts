import logger from 'logger';
import { stripeService } from 'services';

import { userService } from 'resources/user';

type PaymentMethodType = {
  customer: string,
  paymentMethod: string,
};

const updateSubscriptionPaymentMethod = async (data: PaymentMethodType) => {
  try {
    const user = await userService.findOne({ stripeId: data.customer });

    if (user?.subscription?.subscriptionId) {
      await stripeService.subscriptions.update(user?.subscription?.subscriptionId, {
        default_payment_method: data.paymentMethod,
      });
    }
  } catch (error) {
    logger.error(`Error changing default subscription payment method for customer ${data.customer}`, error);
  }
};

export default {
  updateSubscriptionPaymentMethod,
};
