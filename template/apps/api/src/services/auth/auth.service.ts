import tokenService from 'resources/token/token.service';
import type { Token } from 'resources/token/token.schema';
import { TokenType } from 'resources/token/token.schema';
import createToken from 'resources/token/methods/createToken';
import invalidateUserTokens from 'resources/token/methods/invalidateUserTokens';
import validateToken from 'resources/token/methods/validateToken';
import updateLastRequest from 'resources/users/methods/updateLastRequest';

import { clientUtil, cookieUtil } from 'utils';

import { ACCESS_TOKEN } from 'app-constants';
import type { ORPCContext } from 'types';

interface SetAccessTokenOptions {
  ctx: ORPCContext;
  userId: string;
}

export const setAccessToken = async ({ ctx, userId }: SetAccessTokenOptions) => {
  const clientType = clientUtil.detectClientType(ctx);

  const accessToken = await createToken({
    userId,
    type: TokenType.ACCESS,
    expiresIn: ACCESS_TOKEN.INACTIVITY_TIMEOUT_SECONDS,
  });

  if (clientType === clientUtil.ClientType.MOBILE) {
    updateLastRequest(userId);
    return accessToken;
  }

  await cookieUtil.setTokens({
    ctx,
    accessToken,
    expiresIn: ACCESS_TOKEN.ABSOLUTE_EXPIRATION_SECONDS,
  });

  updateLastRequest(userId);

  return accessToken;
};

interface UnsetUserAccessTokenOptions {
  ctx: ORPCContext;
}

export const unsetUserAccessToken = async ({ ctx }: UnsetUserAccessTokenOptions) => {
  const user = ctx.user;

  if (user) {
    await invalidateUserTokens(user._id, TokenType.ACCESS);
  }

  await cookieUtil.unsetTokens({ ctx });
};

export const validateAccessToken = async (value?: string | null): Promise<Token | null> => {
  const token = await validateToken(value, TokenType.ACCESS);

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
