import { AppKoa } from 'types';

import tryToAttachUser from './middlewares/try-to-attach-user.middleware';
import extractTokens from './middlewares/extract-tokens.middleware';
import attachCustomErrors from './middlewares/attach-custom-errors.middleware';
import routeErrorHandler from './middlewares/route-error-handler.middleware';
import publicRoutes from './public.routes';
import privateRoutes from './private.routes';
import adminRoutes from './admin.routes';

const defineRoutes = (app: AppKoa) => {
  app.use(attachCustomErrors);
  app.use(routeErrorHandler);
  app.use(extractTokens);
  app.use(tryToAttachUser);
  
  publicRoutes(app);
  privateRoutes(app);
  adminRoutes(app);
};

export default defineRoutes;
