import type { Token } from '@/db';
import db from '@/db';
import { securityUtil } from '@/utils';

type TokenType = Token['type'];

const getToken = async (tokenId: string | undefined | null, type: TokenType): Promise<Token | null> => {
  if (!tokenId) {
    return null;
  }

  const token = await db.tokens.findFirst({ where: { id: tokenId, type } });

  if (!token) {
    return null;
  }

  const now = new Date();

  if (token.expiresOn.getTime() <= now.getTime()) {
    await db.tokens.deleteMany({ id: tokenId, type });
    return null;
  }

  return token as Token;
};

export default async function validateToken({
  token,
  type,
}: {
  token: string | undefined | null;
  type: TokenType;
}): Promise<Token | null> {
  if (!token) {
    return null;
  }

  const tokenParts = token.split('.');

  if (tokenParts.length !== 2) {
    return null;
  }

  const [tokenId, secret] = tokenParts;

  const foundToken = await getToken(tokenId, type);

  const isValid = await securityUtil.verifyTokenHash(foundToken?.value, secret);

  if (!isValid || !foundToken) {
    return null;
  }

  const now = new Date();

  if (foundToken.expiresOn.getTime() <= now.getTime()) {
    await db.tokens.deleteMany({ id: tokenId, type });
    return null;
  }

  return foundToken;
}
