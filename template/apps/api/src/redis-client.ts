import { createClient } from 'redis';

import config from 'config';
import logger from 'logger';

const client = createClient({ url: config.REDIS_URI });

client.on('error', err => {
  logger.error(`redisClient => Redis error: ${err.stack || err}`);
  throw err;
});

export default client;
