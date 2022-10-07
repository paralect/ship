import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';
import { userRoutes } from 'resources/user';
import { inviteRoutes } from 'resources/invite';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/users', compose([auth, userRoutes.privateRoutes])));
  app.use(mount('/invites', compose([auth, inviteRoutes.privateRoutes])));
};
