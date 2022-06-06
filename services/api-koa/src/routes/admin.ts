import mount from 'koa-mount';
import compose from 'koa-compose';

import userResource from 'resources/user';
import { AppKoa } from 'types';

import adminAuth from './middlewares/adminAuth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/admin/users', compose([adminAuth, userResource.adminRoutes])));
};
