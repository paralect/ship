// allows require modules relative to /src folder
// for example: require('lib/mongo/idGenerator')
// all options can be found here: https://gist.github.com/branneman/8048520
require('app-module-path').addPath(__dirname);
const Koa = require('koa');

process.env.APP_ENV = process.env.APP_ENV || 'development';

const config = require('config');
const logger = require('logger');

process.on('unhandledRejection', (reason, p) => {
  logger.error('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
  // application specific logging here
});

const app = new Koa();
require('./config/koa')(app);

require('services/socketIo.service');

app.listen(config.port, () => {
  logger.warn(`Api server listening on ${config.port}, in ${process.env.NODE_ENV} mode and ${process.env.APP_ENV} environment`);
});

module.exports = app;
