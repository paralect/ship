import { AppKoa, AppRouter } from 'types';

import attachCustomErrors from './middlewares/attachCustomErrors';
import attachCustomProperties from './middlewares/attachCustomProperties';
import extractTokens from './middlewares/extractTokens';
import routeErrorHandler from './middlewares/routeErrorHandler';
import tryToAttachUser from './middlewares/tryToAttachUser';
import { registerRoutes } from './routes';

const healthCheckRouter = new AppRouter();
healthCheckRouter.get('/health', (ctx) => {
  ctx.status = 200;
});

const defineRoutes = async (app: AppKoa) => {
  app.use(attachCustomErrors);
  app.use(attachCustomProperties);
  app.use(routeErrorHandler);
  app.use(extractTokens);
  app.use(tryToAttachUser);

  app.use(healthCheckRouter.routes());

  await registerRoutes(app, AppRouter);
};

export default defineRoutes;
