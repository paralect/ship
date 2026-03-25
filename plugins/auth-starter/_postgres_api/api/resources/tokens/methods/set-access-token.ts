import { ACCESS_TOKEN } from 'app-constants';

import createToken from '@/resources/tokens/methods/create-token';
import updateLastRequest from '@/resources/users/methods/update-last-request';
import type { ORPCContext } from '@/types';
import { clientUtil, cookieUtil } from '@/utils';

interface SetAccessTokenOptions {
  ctx: ORPCContext;
  userId: string;
}

export default async function setAccessToken({ ctx, userId }: SetAccessTokenOptions) {
  const clientType = clientUtil.detectClientType(ctx);

  const accessToken = await createToken({
    userId,
    type: 'access',
  });

  if (clientType === clientUtil.ClientType.MOBILE) {
    updateLastRequest({ userId });
    return accessToken;
  }

  await cookieUtil.setTokens({
    ctx,
    accessToken,
    expiresIn: ACCESS_TOKEN.ABSOLUTE_EXPIRATION_SECONDS,
  });

  updateLastRequest({ userId });

  return accessToken;
}
