import { Redis } from 'ioredis';

import config from 'config';

import logger from 'logger';

const client = new Redis(config.REDIS_URI as string, {
  lazyConnect: true,
  retryStrategy: (times) => {
    if (times > 20) return null;

    return Math.max(Math.min(Math.exp(times), 15_000), 1_000);
  },
});

export const redisErrorHandler = (error: Error) => {
  const errorMessage = `[Redis] ${error.stack || error}`;

  if (config.REDIS_ERRORS_POLICY === 'throw') {
    throw new Error(errorMessage);
  } else {
    logger.error(errorMessage);
  }
};

client.on('error', redisErrorHandler);

client.on('connect', () => logger.info('[Redis] Connection established successfully.'));

export default client;
