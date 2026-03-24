import createToken from 'resources/tokens/methods/create-token';
import { TokenType } from 'resources/tokens/tokens.schema';
import updateLastRequest from 'resources/users/methods/update-last-request';

import { clientUtil, cookieUtil } from 'utils';

import { ACCESS_TOKEN } from 'app-constants';
import type { ORPCContext } from 'types';

interface SetAccessTokenOptions {
  ctx: ORPCContext;
  userId: string;
}

export default async function setAccessToken({ ctx, userId }: SetAccessTokenOptions) {
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
}
