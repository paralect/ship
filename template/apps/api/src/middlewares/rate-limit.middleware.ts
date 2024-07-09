import { ParameterizedContext } from 'koa';
import koaRateLimit, { MiddlewareOptions } from 'koa-ratelimit';

import config from 'config';

import redisClient from 'redis-client';

import { AppKoaContextState } from 'types';

const rateLimit = (
  limitDuration = 1000 * 60, // 60 sec
  requestsPerDuration = 10,
  errorMessage: string | undefined = 'Looks like you are moving too fast. Retry again in few minutes.',
): ReturnType<typeof koaRateLimit> => {
  const isRedisAvailable = !!config.REDIS_URI;

  let dbOptions: Pick<MiddlewareOptions, 'driver' | 'db'> = {
    driver: 'memory',
    db: new Map(),
  };

  if (isRedisAvailable) {
    dbOptions = {
      driver: 'redis',
      db: redisClient,
    };
  }

  return koaRateLimit({
    ...dbOptions,
    duration: limitDuration,
    max: requestsPerDuration,
    id: (ctx: ParameterizedContext<AppKoaContextState>) => ctx.state?.user?._id || ctx.ip,
    errorMessage,
    disableHeader: false,
    throw: true,
  });
};

export default rateLimit;
