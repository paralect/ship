import { routeUtil } from 'utils';

import getPaymentInformation from './actions/get-payment-information';
import getHistory from './actions/get-history';
import createSetupIntent from './actions/create-setup-intent';

const privateRoutes = routeUtil.getRoutes([
  getPaymentInformation,
  getHistory,
  createSetupIntent,
]);

export default {
  privateRoutes,
};
