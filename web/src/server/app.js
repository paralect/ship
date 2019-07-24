// allows require modules relative to /src folder
// for example: require('lib/mongo/idGenerator')
// all options can be found here: https://gist.github.com/branneman/8048520
require('app-module-path').addPath(__dirname);

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
global.logger = require('logger');

const { logger } = global;
const config = require('config');
const Koa = require('koa');

const app = new Koa();
require('./config/koa')(app);

app.listen(config.port, () => {
  logger.warn(`Web application server listening on ${config.port}, in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
