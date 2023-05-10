import { AppKoaContext } from 'types';
import { tokenService } from 'resources/token';

import cookieHelper from './auth.helper';

const setTokens = async (ctx: AppKoaContext, userId: string, isShadow?: boolean) => {
  const { accessToken } = await tokenService.createAuthTokens({ userId, isShadow });

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
