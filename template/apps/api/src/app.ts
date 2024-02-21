// allows to require modules relative to /src folder
// for example: require('lib/mongo/idGenerator')
// all options can be found here: https://gist.github.com/branneman/8048520
import moduleAlias from 'module-alias';
moduleAlias.addPath(__dirname);
moduleAlias(); // read aliases from package json

import 'dotenv/config';

import http from 'http';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import qs from 'koa-qs';
import koaLogger from 'koa-logger';

import { AppKoa } from 'types';

import { socketService } from 'services';

import config from 'config';
import logger from 'logger';
import routes from 'routes';

import redisClient, { redisErrorHandler } from 'redis-client';
import ioEmitter from 'io-emitter';

import db from 'db';

const initKoa = () => {
  const app = new AppKoa();

  app.use(cors({ credentials: true }));
  app.use(helmet());
  qs(app);
  app.use(bodyParser({
    enableTypes: ['json', 'form', 'text'],
    onerror: (err: Error, ctx) => {
      const errText: string = err.stack || err.toString();
      logger.warn(`Unable to parse request body. ${errText}`);
      ctx.throw(422, 'Unable to parse request JSON.');
    },
  }));
  app.use(koaLogger({
    transporter: (message, args) => {
      const [, method, endpoint, status, time, length] = args;

      logger.http(message.trim(), { method, endpoint, status, time, length });
    },
  }));

  routes(app);

  return app;
};

const app = initKoa();

(async () => {
  const server = http.createServer(app.callback());
  const connections = [];

  connections.push(db.connect());

  if (config.REDIS_URI) {
    connections.push(redisClient.connect().then(() => {
      ioEmitter.initClient();
      socketService(server);
    }).catch(redisErrorHandler));
  }

  await Promise.all(connections);

  server.listen(config.PORT, () => {
    logger.info(`API server is listening on ${config.PORT} in ${config.APP_ENV} environment`);
  });
})();

export default app;
