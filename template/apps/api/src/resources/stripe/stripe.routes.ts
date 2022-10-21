import { routeUtil } from 'utils';

import stripeWebhook from './actions/stripe-webhook';

const publicRoutes = routeUtil.getRoutes([
  stripeWebhook,
]);

export default {
  publicRoutes,
};
