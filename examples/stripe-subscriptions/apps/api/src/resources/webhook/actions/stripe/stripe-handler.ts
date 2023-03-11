import logger from 'logger';

import { stripeService } from 'services';
import { userService } from 'resources/user';

type PaymentMethodType = {
  customer: string,
  paymentMethod: string,
};

const updateCustomerDefaultPaymentMethod = async (data: PaymentMethodType) => {
  try {
    await stripeService.customers.update(data.customer, {
      invoice_settings: {
        default_payment_method: data.paymentMethod,
      },
    });
  } catch (error) {
    logger.error(`Error updating customer ${data.customer} default payment method`, error);
  }
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

const updateUserSubscription = async (data: any) => {
  const subscription = {
    subscriptionId: data.id,
    priceId: data.plan.id,
    productId: data.plan.product,
    status: data.status,
    interval: data.plan.interval,
    currentPeriodStartDate: data.current_period_start,
    currentPeriodEndDate: data.current_period_end,
    cancelAtPeriodEnd: data.cancel_at_period_end,
  };

  return userService.atomic.updateOne(
    {
      stripeId: data.customer,
    },
    {
      $set: {
        subscription,
      },
    },
  );
};

const deleteUserSubscription = async (data: any) => {
  return userService.atomic.updateOne(
    {
      stripeId: data.customer,
    },
    {
      $unset: {
        subscription: '',
      },
    },
  );
};

export default {
  updateCustomerDefaultPaymentMethod,
  updateSubscriptionPaymentMethod,
  updateUserSubscription,
  deleteUserSubscription,
};
