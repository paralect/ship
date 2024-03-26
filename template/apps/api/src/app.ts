// allows to require modules relative to /src folder
// for example: require('lib/mongo/idGenerator')
// all options can be found here: https://gist.github.com/branneman/8048520
import cors from '@koa/cors';
import http from 'http';
import ioEmitter from 'io-emitter';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import koaLogger from 'koa-logger';
import qs from 'koa-qs';
import logger from 'logger';
import moduleAlias from 'module-alias'; // read aliases from package json
import redisClient, { redisErrorHandler } from 'redis-client';

import { socketService } from 'services';
import routes from 'routes';

import config from 'config';

import { AppKoa } from 'types';

import 'dotenv/config';

moduleAlias.addPath(__dirname);
moduleAlias();

const initKoa = () => {
  const app = new AppKoa();

  app.use(cors({ credentials: true }));
  app.use(helmet());
  qs(app);
  app.use(
    bodyParser({
      enableTypes: ['json', 'form', 'text'],
      onerror: (err: Error, ctx) => {
        const errText: string = err.stack || err.toString();
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
