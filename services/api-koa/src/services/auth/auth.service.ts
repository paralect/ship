import tokenService from 'resources/token/token.service';
import cookieHelper from './auth.helper';
import { AppKoaContext } from 'types';

const setTokens = async (ctx: AppKoaContext, userId: string) => {
  const { accessToken } = await tokenService.createAuthTokens({ userId });

  if (accessToken) {
    cookieHelper.setTokenCookies({
      ctx,
      accessToken,
    });
  }
};

const unsetTokens = async (ctx: AppKoaContext) => {
  await tokenService.removeAuthTokens(ctx.state.accessToken);
  cookieHelper.unsetTokenCookies(ctx);
};

export default {
  setTokens,
  unsetTokens,
};
