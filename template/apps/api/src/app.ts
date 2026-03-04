import cors from '@koa/cors';
import { koaBody } from 'koa-body';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import koaLogger from 'koa-logger';
import qs from 'koa-qs';
import http from 'node:http';

import { socketService } from 'services';
import defineRoutes from 'routes';

import config from 'config';

import ioEmitter from 'io-emitter';
import redisClient, { redisErrorHandler } from 'redis-client';

import logger from 'logger';

import { AppKoa } from 'types';

const initKoa = async () => {
  const app = new AppKoa();
  app.proxy = true;

  app.use(cors({ credentials: true }));
  app.use(helmet());
  qs(app);
  app.use(
    bodyParser({
      enableTypes: ['json', 'form', 'text'],
      onerror: (err, ctx) => {
        const errText: string = err.stack || err.toString();
        logger.warn(`Unable to parse request body. ${errText}`);
        ctx.throw(422, 'Unable to parse request JSON.');
      },
    }),
  );
  app.use(
    koaBody({
      multipart: true,
      json: false,
      urlencoded: false,
      text: false,
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

  await defineRoutes(app);

  return app;
};

(async () => {
  const app = await initKoa();
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

export default initKoa;
