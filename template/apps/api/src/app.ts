// allows require modules relative to /src folder
// for example: require('lib/mongo/idGenerator')
// all options can be found here: https://gist.github.com/branneman/8048520
import moduleAlias from 'module-alias';
moduleAlias.addPath(__dirname);
moduleAlias(); // read aliases from package json

import * as dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import qs from 'koa-qs';
import requestLogger from 'koa-logger';

import config from 'config';
import logger from 'logger';
import { socketService } from 'services';
import routes from 'routes';
import ioEmitter from 'io-emitter';
import { AppKoa } from 'types';

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
  await Promise.all([
    ioEmitter.initClient(),
    socketService(server),
  ]);

  const message = `Api server listening on ${config.port}, in ${config.env} mode and ${process.env.APP_ENV} env`;
  server.listen(config.port, () => {
    logger.info(message);
  });
})();

export default app;
