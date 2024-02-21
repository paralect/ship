import rateLimit from 'koa-ratelimit';
import { ParameterizedContext } from 'koa';

import redisClient from 'redis-client';

import { AppKoaContextState } from 'types';

const rateLimiter = (limitDuration: number, requestsPerDuration: number): ReturnType<typeof rateLimit> => {
  const errorMessage = 'Looks like you are moving too fast. Retry again in one minute. Please reach out to support with questions.';

  return rateLimit({
    driver: 'redis',
    db: redisClient,
    duration: limitDuration,
    max: requestsPerDuration,
    id: (ctx: ParameterizedContext<AppKoaContextState>) => ctx.state?.user?._id || ctx.ip,
    errorMessage,
    disableHeader: false,
    throw: true,
  });
};

export default rateLimiter;
