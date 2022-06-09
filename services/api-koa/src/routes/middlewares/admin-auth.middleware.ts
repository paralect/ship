import config from 'config';
import { AppKoaContext, Next } from 'types';

const adminAuth = (ctx: AppKoaContext, next: Next) => {
  const key = ctx.header['x-admin-key'];

  if (config.adminKey === key) {
    return next();
  }

  ctx.status = 401;
  ctx.body = {};
  return null;
};

export default adminAuth;
