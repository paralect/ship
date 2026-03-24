import { TokenType } from 'resources/token/token.schema';

import tokenService from 'resources/token/token.service';

export default async function invalidateToken(token?: string | null): Promise<void> {
  if (!token) return;

  const tokenParts = token.split('.');

  if (tokenParts.length !== 2) return;

  const [tokenId] = tokenParts;

  await tokenService.deleteOne({ _id: tokenId, type: TokenType.ACCESS });
}
