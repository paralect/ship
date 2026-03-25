import { ACCESS_TOKEN, EMAIL_VERIFICATION_TOKEN, RESET_PASSWORD_TOKEN } from 'app-constants';

import db from '@/db';
import type { TokenType } from '@/resources/tokens/tokens.schema';
import { securityUtil } from '@/utils';

const expirationSeconds: Record<TokenType, number> = {
  access: ACCESS_TOKEN.INACTIVITY_TIMEOUT_SECONDS,
  'email-verification': EMAIL_VERIFICATION_TOKEN.EXPIRATION_SECONDS,
  'reset-password': RESET_PASSWORD_TOKEN.EXPIRATION_SECONDS,
};

interface CreateTokenOptions {
  userId: string;
  type: TokenType;
  expiresIn?: number;
}

export default async function createToken({ userId, type, expiresIn }: CreateTokenOptions): Promise<string> {
  const secureToken = await securityUtil.generateSecureToken();

  const value = await securityUtil.hashToken(secureToken);

  const now = new Date();
  const expiresOn = new Date(now.getTime() + (expiresIn ?? expirationSeconds[type]) * 1000);
  const token = await db.tokens.insertOne({
    type,
    value,
    userId,
    expiresOn,
  });

  return `${token._id}.${secureToken}`;
}
