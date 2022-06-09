import { routeUtil } from 'utils';
import getCurrent from './actions/get-current';
import list from './actions/list';
import removeAvatar from './actions/remove-avatar';
import updateCurrent from './actions/update-current';
import uploadAvatar from './actions/upload-avatar';
import userService from './user.service';
import update from './actions/update';
import remove from './actions/remove';
import './user.handler';

export * from './user.types';

export default {
  service: userService,
  userService,
  authenticatedRoutes: routeUtil.getRoutes([
    getCurrent,
    list,
    removeAvatar,
    updateCurrent,
    uploadAvatar,
  ]),
  adminRoutes: routeUtil.getRoutes([
    update,
    remove,
  ]),
};
