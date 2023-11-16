import { AppKoaContext, Next } from 'types';
import { COOKIES } from 'app-constants';

const storeTokenToState = async (ctx: AppKoaContext, next: Next) => {
  let accessToken = ctx.cookies.get(COOKIES.ACCESS_TOKEN);

  const { authorization } = ctx.headers;

  if (!accessToken && authorization) {
    accessToken = authorization.replace('Bearer', '').trim();
  }

  if (accessToken) {
    ctx.state.accessToken = accessToken;
  }

  await next();
};

export default storeTokenToState;
