import merge from 'lodash/merge';

const env = process.env.NEXT_PUBLIC_APP_ENV || 'development';
// eslint-disable-next-line import/no-dynamic-require
const config = require(`./${env}.json`);

const base = {
  env,
  port: process.env.PORT || 3002,
  isDev: env === 'development' || env === 'development-docker',
  apiUrl: '',
  wsUrl: '',
  webUrl: '',
  mixpanel: {
    apiKey: process.env.NEXT_PUBLIC_MIXPANEL_API_KEY || '',
  },
};

export default merge(base, config);
