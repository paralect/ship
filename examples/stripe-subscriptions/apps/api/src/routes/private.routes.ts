import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';
import { accountRoutes } from 'resources/account';
import { userRoutes } from 'resources/user';
import { inviteRoutes } from 'resources/invite';
import { paymentRoutes } from 'resources/payment';
import { subscriptionRoutes } from 'resources/subscription';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/account', compose([auth, accountRoutes.privateRoutes])));
  app.use(mount('/users', compose([auth, userRoutes.privateRoutes])));
  app.use(mount('/invites', compose([auth, inviteRoutes.privateRoutes])));
  app.use(mount('/payments', compose([auth, paymentRoutes.privateRoutes])));
  app.use(mount('/subscriptions', compose([auth, subscriptionRoutes.privateRoutes])));
};
