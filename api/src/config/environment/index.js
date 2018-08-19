const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';

let base = {
  env,
  port: process.env.PORT || 3001,
  isDev: env === 'development',
  isTest: env === 'test',
  landingUrl: 'http://localhost:3000',
  webUrl: 'http://localhost:3002',
  apiUrl: 'http://localhost:3001',
  jwt: {
    secret: 'jwt_secret',
    audience: 'api',
    issuer: 'api',
  },
  mongo: {
    connection: 'mongodb://localhost:27017/api',
  },
  mailgun: {
    apiKey: 'key',
    domain: 'domain',
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
