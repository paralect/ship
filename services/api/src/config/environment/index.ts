import { configUtil } from 'utils';
import { COOKIES } from 'app.constants';

const env = process.env.APP_ENV || 'development';

const base = {
  env,
  port: process.env.PORT || 3001,
  isDev: env === 'development',
  accessTokenName: `${env}.${COOKIES.ACCESS_TOKEN}`,
  mongo: {
    connection: '',
    dbName: '',
  },
  cloudStorage: {
    bucket: '',
    endpoint: '',
  },
  apiUrl: '',
  webUrl: '',
  sendgridApiKey: '',
  redis: 'redis://:@redis:6379',
};

const config = configUtil.loadConfig(base, env, __dirname);

export default config;
