import compose from 'koa-compose';
import mount from 'koa-mount';

import { accountRoutes } from 'resources/account';
import { paymentRoutes } from 'resources/payment';
import { subscriptionRoutes } from 'resources/subscription';
import { userRoutes } from 'resources/user';

import { AppKoa } from 'types';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/account', compose([auth, accountRoutes.privateRoutes])));
  app.use(mount('/users', compose([auth, userRoutes.privateRoutes])));
  app.use(mount('/payments', compose([auth, paymentRoutes.privateRoutes])));
  app.use(mount('/subscriptions', compose([auth, subscriptionRoutes.privateRoutes])));
};
