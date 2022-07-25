import { configUtil } from 'utils';
const env = process.env.APP_ENV || 'development';

const base = {
  env,
  port: process.env.PORT || 3001,
  isDev: env === 'development',
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
  adminKey: '',
};

const config = configUtil.loadConfig(base, env, __dirname);

export default config;
