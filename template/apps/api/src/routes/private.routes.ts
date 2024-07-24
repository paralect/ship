import compose from 'koa-compose';
import mount from 'koa-mount';

import { accountRoutes } from 'resources/account';
import { aiChatRoutes } from 'resources/ai-chat';
import { userRoutes } from 'resources/user';

import { AppKoa } from 'types';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/account', compose([auth, accountRoutes.privateRoutes])));
  app.use(mount('/users', compose([auth, userRoutes.privateRoutes])));
  app.use(mount('/ai-chat', compose([auth, aiChatRoutes.privateRoutes])));
};
