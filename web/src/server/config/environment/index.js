const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';

let base = {
  env,
  port: process.env.PORT || 3002,
  isDev: env === 'development',
  isTest: env === 'test',
  session: {
    secret: 'dev_secret',
    ttl: 3600 * 10000,
    store: {
      host: 'redis',
      port: 6379,
    },
  },
  jwt: {
    secret: 'jwt_secret',
    audience: 'api',
    issuer: 'api',
  },
};

const envConfig = require(`./${env}.js`); // eslint-disable-line

base = _.merge(base, envConfig || {});

const loadLocalConfig = (name) => {
  const localConfigPath = path.join(__dirname, name);
  if (fs.existsSync(localConfigPath)) {
    base = _.merge(base, require(localConfigPath)); // eslint-disable-line
    console.log(`loaded ${localConfigPath} config`); // eslint-disable-line
  }
};

// local file can be used to customize any config values during development
if (base.env === 'test') {
  loadLocalConfig('test-local.js');
} else {
  loadLocalConfig('local.js');
}
module.exports = base;
