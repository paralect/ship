import type { Token } from 'resources/token/token.schema';
import { TokenType } from 'resources/token/token.schema';

import { securityUtil } from 'utils';

import tokenService from 'resources/token/token.service';

const getToken = async (tokenId: string | undefined | null, type: TokenType): Promise<Token | null> => {
  if (!tokenId) return null;

  const token = await tokenService.findOne({ _id: tokenId, type });

  if (type && token?.type !== type) return null;

  if (!token) return null;

  const now = new Date();

  if (token.expiresOn.getTime() <= now.getTime()) {
    await tokenService.deleteOne({ _id: tokenId, type });
    return null;
  }

  return token;
};

export default async function validateToken(value: string | undefined | null, type: TokenType): Promise<Token | null> {
  if (!value) return null;

  const tokenParts = value.split('.');

  if (tokenParts.length !== 2) return null;

  const [tokenId, secret] = tokenParts;

  const token = await getToken(tokenId, type);

  const isValid = await securityUtil.verifyTokenHash(token?.value, secret);

  if (!isValid || !token) return null;

  const now = new Date();

  if (token.expiresOn.getTime() <= now.getTime()) {
    await tokenService.deleteOne({ _id: tokenId, type });
    return null;
  }

  return token;
}
