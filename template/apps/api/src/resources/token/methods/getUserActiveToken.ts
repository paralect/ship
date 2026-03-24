import type { Token } from 'resources/token/token.schema';
import { TokenType } from 'resources/token/token.schema';

import tokenService from 'resources/token/token.service';

export default async function getUserActiveToken(userId: string, type: TokenType): Promise<Token | null> {
  const token = await tokenService.findOne({ userId, type });

  if (!token) return null;

  const now = new Date();

  if (token.expiresOn.getTime() <= now.getTime()) {
    await tokenService.deleteOne({ _id: token._id });

    return null;
  }

  return token;
}
