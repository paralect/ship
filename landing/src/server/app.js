const { createServer } = require('http');
const { parse } = require('url');
const { resolve } = require('path');

const next = require('next');
const nextBuild = require('next/dist/server/build').default;

const logger = require('./logger');
const config = require('./config');
const nextJsConfig = require('./config/next.config.js');

const nextDir = resolve(__dirname, './../client');

const main = async () => {
  if (config.env !== 'development') {
    logger.info('next build');
    await nextBuild(nextDir, nextJsConfig);
  }

  const app = next({
    dev: config.isDev,
    dir: nextDir,
    conf: nextJsConfig,
  });

  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    createServer((req, res) => {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);

      // const { pathname, query } = parsedUrl;
      // Custom routing example
      // if (pathname === '/a') {
      //   app.render(req, res, '/b', query);
      // } else {
      //   handle(req, res, parsedUrl);
      // }

      handle(req, res, parsedUrl);
    }).listen(config.port, (err) => {
      if (err) throw err;
      logger.info(`> Ready on http://localhost:${config.port}`);
    });
  });
};

main();
