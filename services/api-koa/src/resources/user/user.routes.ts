import { routeUtil } from 'utils';

import getCurrent from './actions/get-current';
import list from './actions/list';
import removeAvatar from './actions/remove-avatar';
import updateCurrent from './actions/update-current';
import uploadAvatar from './actions/upload-avatar';
import update from './actions/update';
import remove from './actions/remove';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([
  getCurrent,
  list,
  removeAvatar,
  updateCurrent,
  uploadAvatar,
]);

const adminRoutes = routeUtil.getRoutes([
  update,
  remove,
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
