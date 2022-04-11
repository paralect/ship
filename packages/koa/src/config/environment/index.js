const env = process.env.APP_ENV || 'development';

// eslint-disable-next-line import/no-dynamic-require
const base = require(`./${env}.json`);

const config = {
  env,
  port: process.env.PORT || 3001,
  isDev: env === 'development',
  ...base,
};

module.exports = config;
