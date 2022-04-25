import { routeUtil } from 'utils';
import getCurrent from './actions/get-current';
import list from './actions/list';
import removeAvatar from './actions/remove-avatar';
import updateCurrent from './actions/update-current';
import uploadAvatar from './actions/upload-avatar';
import userService from './user.service';
import './user.handler';

export * from './user.types';

export default {
  service: userService,
  routes: routeUtil.getRoutes([
    getCurrent,
    list,
    removeAvatar,
    updateCurrent,
    uploadAvatar,
  ]),
};
