import { AppKoaContext, Next } from 'types';

import config from 'config';

const adminAuth = (ctx: AppKoaContext, next: Next) => {
  const adminKey = ctx.header['x-admin-key'];

  if (config.ADMIN_KEY && config.ADMIN_KEY === adminKey) {
    return next();
  }

  ctx.status = 401;
  ctx.body = {};

  return null;
};

export default adminAuth;
