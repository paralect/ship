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
import requestLogger from 'koa-logger';

import { AppKoa } from 'types';

import { socketService } from 'services';

import config from 'config';
import logger from 'logger';
import routes from 'routes';

import { redisErrorHandler } from 'redis-client';
import ioEmitter from 'io-emitter';

const initKoa = () => {
  const app = new AppKoa();

  app.use(cors({ credentials: true }));
  app.use(helmet());
  qs(app as any);
  app.use(bodyParser({
    enableTypes: ['json', 'form', 'text'],
    onerror: (err: Error, ctx) => {
      const errText: string = err.stack || err.toString();
      logger.warn(`Unable to parse request body. ${errText}`);
      ctx.throw(422, 'Unable to parse request JSON.');
    },
  }));
  app.use(requestLogger());

  routes(app);

  return app;
};

const app = initKoa();

(async () => {
  const server = http.createServer(app.callback());

  if (config.REDIS_URI) {
    try {
      await Promise.all([
        ioEmitter.initClient(),
        socketService(server),
      ]);
    } catch (e) {
      if (e instanceof Error) redisErrorHandler(e);
    }
  }

  server.listen(config.PORT, () => {
    logger.info(`API server is listening on ${config.PORT}, in ${config.APP_ENV} environment`);
  });
})();

export default app;
