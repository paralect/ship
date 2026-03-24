import { TokenType } from 'resources/tokens/tokens.schema';

import { tokensService } from 'db';

export default async function invalidateToken(token?: string | null): Promise<void> {
  if (!token) return;

  const tokenParts = token.split('.');

  if (tokenParts.length !== 2) return;

  const [tokenId] = tokenParts;

  await tokensService.deleteOne({ _id: tokenId, type: TokenType.ACCESS });
}
