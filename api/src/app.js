require('app-module-path').addPath(__dirname);

const Koa = require('koa');
const http = require('http');
const config = require('config');
const logger = require('logger');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const qs = require('koa-qs');
const bodyParser = require('koa-bodyparser');
const requestLogger = require('koa-logger');

const routes = require('routes');

process.on('unhandledRejection', (reason, p) => {
  logger.error('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

const app = new Koa();

app.use(cors({ credentials: true }));
app.use(helmet());
qs(app);
app.use(bodyParser({ enableTypes: ['json', 'form', 'text'] }));
app.use(requestLogger());

routes(app);

const server = http.createServer(app.callback());
require('services/socket/socket.service')(server);

server.listen(config.port, () => {
  logger.warn(`Api server listening on ${config.port}, in ${process.env.NODE_ENV} mode and ${process.env.APP_ENV} environment`);
});

module.exports = app;
