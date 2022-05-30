import { AppKoaContext, Next } from 'types';
import config from 'config';

const auth = (ctx: AppKoaContext, next: Next) => {
  if (ctx.state.user) {
    return next();
  }

  const key = ctx.header['x-admin-key'];
  
  if (config.adminKey === key) {
    return next();
  }

  ctx.status = 401;
  ctx.body = {};
  return null;
};

export default auth;
