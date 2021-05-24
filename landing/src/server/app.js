const { createServer } = require('http');
const { parse } = require('url');
const { resolve } = require('path');

const next = require('next');

const logger = require('./logger');
const config = require('./config');
const nextJsConfig = require('./config/next.config.js');

const nextDir = resolve(__dirname, './../client');

const main = async () => {
  const app = next({
    dev: config.isDev,
    dir: nextDir,
    conf: nextJsConfig,
  });

  const handle = app.getRequestHandler();

  await app.prepare();

  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname === '/health') {
      res.statusCode = 200;
      res.end('OK');
    }

    handle(req, res, parsedUrl);
  }).listen(config.port, (err) => {
    if (err) throw err;
    logger.info(`> Ready on http://localhost:${config.port}`);
  });
};

main();
