import { AppKoa, AppRouter } from 'types';

import attachCustomErrors from './middlewares/attach-custom-errors.middleware';
import attachCustomProperties from './middlewares/attach-custom-properties.middleware';
import extractTokens from './middlewares/extract-tokens.middleware';
import routeErrorHandler from './middlewares/route-error-handler.middleware';
import tryToAttachUser from './middlewares/try-to-attach-user.middleware';
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
