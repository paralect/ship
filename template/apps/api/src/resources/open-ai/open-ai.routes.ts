import { routeUtil } from 'utils';

import chat from './actions/chat';
import getById from './actions/get-by-id';
import list from './actions/list';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([chat, list, getById]);

const adminRoutes = routeUtil.getRoutes([chat, list, getById]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
