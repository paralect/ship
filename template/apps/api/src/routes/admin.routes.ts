import compose from 'koa-compose';
import mount from 'koa-mount';

import { userRoutes } from 'resources/user';

import { AppKoa } from 'types';

import adminAuth from './middlewares/admin-auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/admin/users', compose([adminAuth, userRoutes.adminRoutes])));
};
