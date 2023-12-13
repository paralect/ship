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
      const baseDelay = 1_000;

      return Math.min(baseDelay * Math.pow(2, retries), maxDelay);
    },
  },
});

export const redisErrorHandler = (error: Error) => {
  const errorMessage = `[Redis Client] ${error.stack || error}`;

  if (config.REDIS_ERRORS_POLICY === 'throw') {
    throw new Error(errorMessage);
  } else {
    logger.error(errorMessage);
  }
};

client.on('error', redisErrorHandler);

export default client;
