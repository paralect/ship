import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';
import userResource from 'resources/user';

import adminAuth from './middlewares/admin-auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/admin/users', compose([adminAuth, userResource.adminRoutes])));
};
