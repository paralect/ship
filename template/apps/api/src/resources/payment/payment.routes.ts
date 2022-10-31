import { routeUtil } from 'utils';

import getHistory from './actions/get-history';
import createSetupIntent from './actions/create-setup-intent';

const privateRoutes = routeUtil.getRoutes([
  getHistory,
  createSetupIntent,
]);

export default {
  privateRoutes,
};
