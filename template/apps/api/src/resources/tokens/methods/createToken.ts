import { securityUtil } from 'utils';

import { tokensService } from 'db';
import type { Token } from 'resources/tokens/tokens.schema';
import { TokenType } from 'resources/tokens/tokens.schema';

interface CreateTokenOptions {
  userId: string;
  type: TokenType;
  expiresIn: number;
}

export default async function createToken({ userId, type, expiresIn }: CreateTokenOptions): Promise<string> {
  const secureToken = await securityUtil.generateSecureToken();

  const value = await securityUtil.hashToken(secureToken);

  const now = new Date();
  const expiresOn = new Date(now.getTime() + expiresIn * 1000);
  const token = await tokensService.insertOne({
    type,
    value,
    userId,
    expiresOn,
  });

  return `${token._id}.${secureToken}`;
}
