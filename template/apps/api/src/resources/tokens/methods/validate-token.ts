import { and, eq } from 'drizzle-orm';

import { db, tokens } from '@/db';
import type { Token } from '@/resources/tokens/tokens.schema';
import { TokenType } from '@/resources/tokens/tokens.schema';
import { securityUtil } from '@/utils';

const getToken = async (tokenId: string | undefined | null, type: TokenType): Promise<Token | null> => {
  if (!tokenId) return null;

  const [token] = await db
    .select()
    .from(tokens)
    .where(and(eq(tokens.id, tokenId), eq(tokens.type, type)))
    .limit(1);

  if (!token) return null;

  const now = new Date();

  if (token.expiresOn.getTime() <= now.getTime()) {
    await db.delete(tokens).where(and(eq(tokens.id, tokenId), eq(tokens.type, type)));
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
  if (!token) return null;

  const tokenParts = token.split('.');

  if (tokenParts.length !== 2) return null;

  const [tokenId, secret] = tokenParts;

  const foundToken = await getToken(tokenId, type);

  const isValid = await securityUtil.verifyTokenHash(foundToken?.value, secret);

  if (!isValid || !foundToken) return null;

  const now = new Date();

  if (foundToken.expiresOn.getTime() <= now.getTime()) {
    await db.delete(tokens).where(and(eq(tokens.id, tokenId), eq(tokens.type, type)));
    return null;
  }

  return foundToken;
}
