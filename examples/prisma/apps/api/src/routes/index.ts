import { AppKoa } from 'types';

import attachCustomErrors from './middlewares/attach-custom-errors.middleware';
import attachCustomProperties from './middlewares/attach-custom-properties.middleware';
import extractTokens from './middlewares/extract-tokens.middleware';
import routeErrorHandler from './middlewares/route-error-handler.middleware';
import tryToAttachUser from './middlewares/try-to-attach-user.middleware';
import adminRoutes from './admin.routes';
import privateRoutes from './private.routes';
import publicRoutes from './public.routes';

const defineRoutes = (app: AppKoa) => {
  app.use(attachCustomErrors);
  app.use(attachCustomProperties);
  app.use(routeErrorHandler);
  app.use(extractTokens);
  app.use(tryToAttachUser);

  publicRoutes(app);
  privateRoutes(app);
  adminRoutes(app);
};

export default defineRoutes;
