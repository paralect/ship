import { routeUtil } from 'utils';
import getAction from './actions/get';

export default {
  routes: routeUtil.getRoutes([
    getAction,
  ]),
};
