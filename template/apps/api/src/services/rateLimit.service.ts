import rateLimit from 'koa-ratelimit';
// import { RedisClientType as Redis } from 'redis';
// import redis from 'redis-client';

const rateLimiter = (duration: number, limit: number): any => {
  const errorMessage = 'Looks like you are moving too fast. Retry again in one minute. Please reach out to support with questions.';

  const driver: {
    driver: 'memory' | 'redis',
    db: Map<any, any>;
  } = {
    driver: 'memory',
    db: new Map(),
  };

  return rateLimit({
    ...driver,
    duration,
    errorMessage,
    id: (ctx) => ctx.state?.user?._id || ctx.ip,
    headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total',
    },
    max: limit,
    disableHeader: false,
    throw: true,
  });
};

export default rateLimiter;
