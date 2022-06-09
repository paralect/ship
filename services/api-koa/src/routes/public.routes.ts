import mount from 'koa-mount';

import { AppKoa } from 'types';
import accountResource from 'resources/account';
import healthResource from 'resources/health/public';

export default (app: AppKoa) => {
  app.use(mount('/account', accountResource.publicRoutes));
  app.use(mount('/health', healthResource.routes));
};
