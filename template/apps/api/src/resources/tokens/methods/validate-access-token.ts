import { and, eq } from 'drizzle-orm';

import { ACCESS_TOKEN } from 'app-constants';

import { db, tokens } from '@/db';
import validateToken from '@/resources/tokens/methods/validate-token';
import type { Token } from '@/resources/tokens/tokens.schema';
import { TokenType } from '@/resources/tokens/tokens.schema';

export default async function validateAccessToken(value?: string | null): Promise<Token | null> {
  const token = await validateToken({ token: value, type: TokenType.ACCESS });

  if (!token || token.type !== TokenType.ACCESS) return null;

  const now = new Date();

  if (
    token.expiresOn.getTime() - now.getTime() <=
    ACCESS_TOKEN.INACTIVITY_TIMEOUT_SECONDS * 1000 - ACCESS_TOKEN.ACTIVITY_CHECK_INTERVAL_SECONDS * 1000
  ) {
    const newExpiresOn = new Date(now.getTime() + ACCESS_TOKEN.INACTIVITY_TIMEOUT_SECONDS * 1000);

    await db
      .update(tokens)
      .set({ expiresOn: newExpiresOn })
      .where(and(eq(tokens.id, token.id), eq(tokens.type, TokenType.ACCESS)));

    token.expiresOn = newExpiresOn;
  }

  return token;
}
