import { routeUtil } from 'utils';

import createSetupIntent from './actions/create-setup-intent';

const privateRoutes = routeUtil.getRoutes([
  createSetupIntent,
]);

export default {
  privateRoutes,
};
