import { routeUtil } from 'utils';

import list from './actions/list';
import update from './actions/update';
import remove from './actions/remove';

const publicRoutes = routeUtil.getRoutes([

]);

const privateRoutes = routeUtil.getRoutes([
  list,
]);

const adminRoutes = routeUtil.getRoutes([
  list,
  update,
  remove,
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
