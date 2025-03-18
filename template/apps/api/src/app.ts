/* eslint-disable simple-import-sort/imports, import/newline-after-import, import/first */
// Allows requiring modules relative to /src folder,
// For example, require('lib/mongo/idGenerator')
// All options can be found here: https://gist.github.com/branneman/8048520
import moduleAlias from 'module-alias';
moduleAlias.addPath(__dirname);
moduleAlias(); // read aliases from package json

import 'dotenv/config';

import cors from '@koa/cors';
import http from 'http';
import { koaBody } from 'koa-body';

import helmet from 'koa-helmet';
import koaLogger from 'koa-logger';
import qs from 'koa-qs';

import { socketService } from 'services';
import routes from 'routes';

import config from 'config';

import ioEmitter from 'io-emitter';
import redisClient, { redisErrorHandler } from 'redis-client';

import logger from 'logger';

import { AppKoa } from 'types';

const initKoa = () => {
  const app = new AppKoa();
  app.proxy = true;

  app.use(cors({ credentials: true }));
  app.use(helmet());
  qs(app);
  app.use(
    koaBody({
      multipart: true,
      onError: (error, ctx) => {
        const errText: string = error.stack || error.toString();

        logger.warn(`Unable to parse request body. ${errText}`);
        ctx.throw(422, 'Unable to parse request JSON.');
      },
    }),
  );
  app.use(
    koaLogger({
      transporter: (message, args) => {
        const [, method, endpoint, status, time, length] = args;

        logger.http(message.trim(), { method, endpoint, status, time, length });
      },
    }),
  );

  routes(app);

  return app;
};

const app = initKoa();

(async () => {
  const server = http.createServer(app.callback());

  if (config.REDIS_URI) {
    await redisClient
      .connect()
      .then(() => {
        ioEmitter.initClient();
        socketService(server);
      })
      .catch(redisErrorHandler);
  }

  server.listen(config.PORT, () => {
    logger.info(`API server is listening on ${config.PORT} in ${config.APP_ENV} environment`);
  });
})();

export default app;
