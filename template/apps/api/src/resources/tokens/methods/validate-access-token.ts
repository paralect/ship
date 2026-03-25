import { ACCESS_TOKEN } from 'app-constants';

import type { Token } from '@/db';
import db from '@/db';
import validateToken from '@/resources/tokens/methods/validate-token';

export default async function validateAccessToken(value?: string | null): Promise<Token | null> {
  const token = await validateToken({ token: value, type: 'access' });

  if (!token || token.type !== 'access') {
    return null;
  }

  const now = new Date();

  if (
    token.expiresOn.getTime() - now.getTime() <=
    ACCESS_TOKEN.INACTIVITY_TIMEOUT_SECONDS * 1000 - ACCESS_TOKEN.ACTIVITY_CHECK_INTERVAL_SECONDS * 1000
  ) {
    const newExpiresOn = new Date(now.getTime() + ACCESS_TOKEN.INACTIVITY_TIMEOUT_SECONDS * 1000);

    await db.tokens.updateOne({ id: token.id, type: 'access' }, { expiresOn: newExpiresOn });

    token.expiresOn = newExpiresOn;
  }

  return token;
}
