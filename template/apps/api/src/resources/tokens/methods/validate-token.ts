import { tokensService } from '@/db';
import type { Token } from '@/resources/tokens/tokens.schema';
import { TokenType } from '@/resources/tokens/tokens.schema';
import { securityUtil } from '@/utils';

const getToken = async (tokenId: string | undefined | null, type: TokenType): Promise<Token | null> => {
  if (!tokenId) return null;

  const token = await tokensService.findOne({ _id: tokenId, type });

  if (type && token?.type !== type) return null;

  if (!token) return null;

  const now = new Date();

  if (token.expiresOn.getTime() <= now.getTime()) {
    await tokensService.deleteOne({ _id: tokenId, type });
    return null;
  }

  return token;
};

export default async function validateToken({
  token,
  type,
}: {
  token: string | undefined | null;
  type: TokenType;
}): Promise<Token | null> {
  if (!token) return null;

  const tokenParts = token.split('.');

  if (tokenParts.length !== 2) return null;

  const [tokenId, secret] = tokenParts;

  const foundToken = await getToken(tokenId, type);

  const isValid = await securityUtil.verifyTokenHash(foundToken?.value, secret);

  if (!isValid || !foundToken) return null;

  const now = new Date();

  if (foundToken.expiresOn.getTime() <= now.getTime()) {
    await tokensService.deleteOne({ _id: tokenId, type });
    return null;
  }

  return foundToken;
}
