import type { Token } from '@/db';
import db from '@/db';
import { securityUtil } from '@/utils';

interface CreateTokenOptions {
  userId: string;
  type: Token['type'];
  expiresIn: number;
}

export default async function createToken({ userId, type, expiresIn }: CreateTokenOptions): Promise<string> {
  const secureToken = await securityUtil.generateSecureToken();

  const value = await securityUtil.hashToken(secureToken);

  const now = new Date();
  const expiresOn = new Date(now.getTime() + expiresIn * 1000);
  const token = await db.tokens.insertOne({ type, value, userId, expiresOn });

  return `${token.id}.${secureToken}`;
}
