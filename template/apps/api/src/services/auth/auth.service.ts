import { tokenService } from 'resources/token';
import { userService } from 'resources/user';

import { cookieUtil } from 'utils';

import { ACCESS_TOKEN } from 'app-constants';
import { AppKoaContext, Token, TokenType } from 'types';

interface SetAccessTokenOptions {
  ctx: AppKoaContext;
  userId: string;
}

export const setAccessToken = async ({ ctx, userId }: SetAccessTokenOptions) => {
  const accessToken = await tokenService.createToken({
    userId,
    type: TokenType.ACCESS,
    expiresIn: ACCESS_TOKEN.INACTIVITY_TIMEOUT_SECONDS,
  });

  await cookieUtil.setTokens({
    ctx,
    accessToken,
    expiresIn: ACCESS_TOKEN.ABSOLUTE_EXPIRATION_SECONDS,
  });

  userService.updateLastRequest(userId);

  return accessToken;
};

interface UnsetUserAccessTokenOptions {
  ctx: AppKoaContext;
}

export const unsetUserAccessToken = async ({ ctx }: UnsetUserAccessTokenOptions) => {
  const { user } = ctx.state;

  if (user) await tokenService.invalidateUserTokens(user._id, TokenType.ACCESS);

  await cookieUtil.unsetTokens({ ctx });
};

export const validateAccessToken = async (value?: string | null): Promise<Token | null> => {
  const token = await tokenService.validateToken(value, TokenType.ACCESS);

  if (!token || token.type !== TokenType.ACCESS) return null;

  const now = new Date();

  if (
    token.expiresOn.getTime() - now.getTime() <=
    ACCESS_TOKEN.INACTIVITY_TIMEOUT_SECONDS * 1000 - ACCESS_TOKEN.ACTIVITY_CHECK_INTERVAL_SECONDS * 1000
  ) {
    const newExpiresOn = new Date(now.getTime() + ACCESS_TOKEN.INACTIVITY_TIMEOUT_SECONDS * 1000);

    await tokenService.updateOne({ _id: token._id, type: TokenType.ACCESS }, () => ({ expiresOn: newExpiresOn }));

    token.expiresOn = newExpiresOn;
  }

  return token;
};
