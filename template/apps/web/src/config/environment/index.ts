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
  stripePublicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_51JiFOKDgd1tzhAXh9m0JJEEeWFonDJjOqZU2NY3xoCodVWIiE7Kh11ZIrpeE9dyCeuqmbr5k5n1uascna1wsbfwp00JC9h97kx',
  subscriptions: {
    starter: {
      month: 'price_1LvIwjDgd1tzhAXhGwvrRWai',
      year: 'price_1LvIwjDgd1tzhAXhEaS9AsE3',
    },
    pro: {
      month: 'price_1LvIxzDgd1tzhAXhlVkSJAN8',
      year: 'price_1LvIxzDgd1tzhAXhWO9IMklL',
    },
  },
  mixpanel: {
    apiKey: process.env.NEXT_PUBLIC_MIXPANEL_API_KEY,
  },
};

export default merge(base, config);
