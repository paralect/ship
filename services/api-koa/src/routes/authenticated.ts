import mount from 'koa-mount';
import userResource from 'resources/user';
import { AppKoa } from 'types';

export default (app: AppKoa) => {
  app.use(mount('/users', userResource.routes));
};
