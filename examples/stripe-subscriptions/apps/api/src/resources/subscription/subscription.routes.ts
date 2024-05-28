import { routeUtil } from 'utils';

import cancel from './actions/cancel';
import getCurrent from './actions/get-current';
import previewUpgrade from './actions/preview-upgrade';
import subscribe from './actions/subscribe';
import upgrade from './actions/upgrade';

const privateRoutes = routeUtil.getRoutes([getCurrent, subscribe, previewUpgrade, upgrade, cancel]);

export default {
  privateRoutes,
};
