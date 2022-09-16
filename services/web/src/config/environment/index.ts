// eslint-disable-next-line import/no-dynamic-require
const config = require(`./${process.env.NEXT_PUBLIC_APP_ENV || 'development'}.json`);

export default config;
