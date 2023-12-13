import { createClient } from 'redis';

import config from 'config';
import logger from 'logger';

const client = createClient({
  url: config.REDIS_URI,
  pingInterval: 1_000,
  socket: {
    connectTimeout: 30_000,
    reconnectStrategy: (retries) => {
      const maxDelay = 5_000;
      const baseDelay = 50;

      return Math.min(baseDelay * Math.pow(2, retries), maxDelay);
    },
  },
});

client.on('error', err => {
  const errorMessage = `redisClient => Redis error: ${err.stack || err}`;

  if (config.REDIS_ERRORS_POLICY === 'throw') {
    throw Error(errorMessage);
  } else {
    logger.error(errorMessage);
  }
});

export default client;
