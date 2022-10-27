import Stripe from 'stripe';

import { userService, userHelper } from 'resources/user';
import { subscriptionService } from 'resources/subscription';

export default function (event: Stripe.Event) {
  switch (event.type) {
    case 'customer.created':
      userService.attachStripeCustomerId(event.data.object);
      return;
    case 'setup_intent.succeeded':
      userHelper.updateDefaultPaymentMethod(event.data.object);
      return;
    case 'customer.subscription.updated':
      subscriptionService.updateSubscription(event.data.object);
      return;
    case 'customer.subscription.deleted':
      subscriptionService.deleteSubscription(event.data.object);
  }
}
