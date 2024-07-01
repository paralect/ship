import mount from 'koa-mount';

import { accountRoutes } from 'resources/account';
import { webhookRoutes } from 'resources/webhook';

import { AppKoa, AppRouter } from 'types';

const healthCheckRouter = new AppRouter();
healthCheckRouter.get('/health', (ctx) => {
  ctx.status = 200;
});

export default (app: AppKoa) => {
  app.use(healthCheckRouter.routes());
  app.use(mount('/account', accountRoutes.publicRoutes));
  app.use(mount('/webhook', webhookRoutes.publicRoutes));
};
