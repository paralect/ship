import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';
import { userRoutes } from 'resources/user';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/users', compose([auth, userRoutes.privateRoutes])));
};
