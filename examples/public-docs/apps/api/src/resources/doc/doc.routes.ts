import { routeUtil } from 'utils';

import getJson from './actions/getJson';

const publicRoutes = routeUtil.getRoutes([
  getJson,
]);

export default {
  publicRoutes,
};
