import { routeUtil } from 'utils';

import chat from './actions/chat';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([chat]);

const adminRoutes = routeUtil.getRoutes([chat]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
