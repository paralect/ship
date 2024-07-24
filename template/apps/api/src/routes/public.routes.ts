import mount from 'koa-mount';

import { accountRoutes } from 'resources/account';
import { aiChatRoutes } from 'resources/ai-chat';

import { AppKoa, AppRouter } from 'types';

const healthCheckRouter = new AppRouter();
healthCheckRouter.get('/health', (ctx) => {
  ctx.status = 200;
});

export default (app: AppKoa) => {
  app.use(healthCheckRouter.routes());
  app.use(mount('/account', accountRoutes.publicRoutes));
  app.use(mount('/ai-chat', aiChatRoutes.publicRoutes));
};
