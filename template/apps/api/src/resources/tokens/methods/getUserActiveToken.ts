import type { Token } from 'resources/tokens/tokens.schema';
import { TokenType } from 'resources/tokens/tokens.schema';

import { tokensService } from 'db';


export default async function getUserActiveToken(userId: string, type: TokenType): Promise<Token | null> {
  const token = await tokensService.findOne({ userId, type });

  if (!token) return null;

  const now = new Date();

  if (token.expiresOn.getTime() <= now.getTime()) {
    await tokensService.deleteOne({ _id: token._id });

    return null;
  }

  return token;
}
