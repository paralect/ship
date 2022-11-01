import Stripe from 'stripe';

import { userService, userHelper } from 'resources/user';
import { subscriptionHelper } from 'resources/subscription';

export default function (event: Stripe.Event) {
  switch (event.type) {
    case 'setup_intent.succeeded':
      const setupIntent = event.data.object as Stripe.SetupIntent;
      userHelper.updateDefaultPaymentMethod({
        customer: setupIntent.customer as string,
        paymentMethod: setupIntent.payment_method as string,
      });
      subscriptionHelper.updateSubscriptionPaymentMethod({
        customer: setupIntent.customer as string,
        paymentMethod: setupIntent.payment_method as string,
      });
      return;
      // TODO: Remove if going to remove default payment methods for subscriptions
    case 'payment_method.attached':
      const paymentMethod = event.data.object as Stripe.PaymentMethod;
      userHelper.updateDefaultPaymentMethod({
        customer: paymentMethod.customer as string,
        paymentMethod: paymentMethod.id as string,
      });
      return;
    case 'customer.subscription.updated':
      userService.updateSubscription(event.data.object);
      return;
    case 'customer.subscription.deleted':
      userService.deleteSubscription(event.data.object);
  }
}
