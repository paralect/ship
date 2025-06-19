import { tokenService } from 'resources/token';

import { ACCESS_TOKEN_INACTIVITY_TIMEOUT_SECONDS } from 'app-constants';
import { AppKoaContext } from 'types';

import cookieUtil from './cookie.util';

interface SetAuthTokenOptions {
  ctx: AppKoaContext;
  userId: string;
}

export const setAuthToken = async ({ ctx, userId }: SetAuthTokenOptions) => {
  const accessToken = await tokenService.createAccessToken({ userId });

  await cookieUtil.setTokens({
    ctx,
    accessToken,
    expiresIn: ACCESS_TOKEN_INACTIVITY_TIMEOUT_SECONDS,
  });

  return accessToken;
};

interface RemoveAuthTokenOptions {
  ctx: AppKoaContext;
}

export const removeAuthToken = async ({ ctx }: RemoveAuthTokenOptions) => {
  const { accessToken } = ctx.state;

  await tokenService.invalidateAccessToken(accessToken);

  await cookieUtil.unsetTokens({ ctx });
};
