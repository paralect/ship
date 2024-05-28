import { routeUtil } from 'utils';

import stripeWebhook from './actions/stripe';

const publicRoutes = routeUtil.getRoutes([stripeWebhook]);

export default {
  publicRoutes,
};
