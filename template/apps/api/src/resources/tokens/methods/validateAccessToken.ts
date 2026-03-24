import validateToken from 'resources/tokens/methods/validateToken';
import type { Token } from 'resources/tokens/tokens.schema';
import { TokenType } from 'resources/tokens/tokens.schema';

import { tokensService } from 'db';

import { ACCESS_TOKEN } from 'app-constants';

export default async function validateAccessToken(value?: string | null): Promise<Token | null> {
  const token = await validateToken(value, TokenType.ACCESS);

  if (!token || token.type !== TokenType.ACCESS) return null;

  const now = new Date();

  if (
    token.expiresOn.getTime() - now.getTime() <=
    ACCESS_TOKEN.INACTIVITY_TIMEOUT_SECONDS * 1000 - ACCESS_TOKEN.ACTIVITY_CHECK_INTERVAL_SECONDS * 1000
  ) {
    const newExpiresOn = new Date(now.getTime() + ACCESS_TOKEN.INACTIVITY_TIMEOUT_SECONDS * 1000);

    await tokensService.updateOne({ _id: token._id, type: TokenType.ACCESS }, () => ({ expiresOn: newExpiresOn }));

    token.expiresOn = newExpiresOn;
  }

  return token;
}
