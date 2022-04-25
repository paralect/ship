import mount from 'koa-mount';
import accountResource from 'resources/account/public';
import healthResource from 'resources/health/public';
import { AppKoa } from 'types';

export default (app: AppKoa) => {
  app.use(mount('/account', accountResource.routes));
  app.use(mount('/health', healthResource.routes));
};
