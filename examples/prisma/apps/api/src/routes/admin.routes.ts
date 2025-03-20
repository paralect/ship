import compose from 'koa-compose';
import mount from 'koa-mount';

import { accountRoutes } from 'resources/account';
import { userRoutes } from 'resources/user';

import { AppKoa } from 'types';

import adminAuth from './middlewares/admin-auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/admin/account', compose([adminAuth, accountRoutes.adminRoutes])));
  app.use(mount('/admin/users', compose([adminAuth, userRoutes.adminRoutes])));
};
