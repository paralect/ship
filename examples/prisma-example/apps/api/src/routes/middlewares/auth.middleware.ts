import { AppKoaContext, Next } from 'types';

const auth = (ctx: AppKoaContext, next: Next) => {
  if (ctx.state.user) {
    return next();
  }

  ctx.status = 401;

  return null;
};

export default auth;
