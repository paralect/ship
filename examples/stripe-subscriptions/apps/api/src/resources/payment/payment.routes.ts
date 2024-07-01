import { routeUtil } from 'utils';

import createSetupIntent from './actions/create-setup-intent';
import getHistory from './actions/get-history';
import getPaymentInformation from './actions/get-payment-information';

const privateRoutes = routeUtil.getRoutes([getPaymentInformation, getHistory, createSetupIntent]);

export default {
  privateRoutes,
};
