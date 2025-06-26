import { securityUtil } from 'utils';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { tokenSchema } from 'schemas';
import { Token, TokenType } from 'types';

const service = db.createService<Token>(DATABASE_DOCUMENTS.TOKENS, {
  schemaValidator: (obj) => tokenSchema.parseAsync(obj),
});

service.createIndex({ expiresOn: 1 }, { expireAfterSeconds: 0 });
service.createIndex({ userId: 1, type: 1 });

interface CreateTokenOptions {
  userId: string;
  type: TokenType;
  expiresIn: number;
}

const createToken = async ({ userId, type, expiresIn }: CreateTokenOptions): Promise<string> => {
  const secureToken = await securityUtil.generateSecureToken();

  const value = await securityUtil.hashToken(secureToken);

  const now = new Date();
  const expiresOn = new Date(now.getTime() + expiresIn * 1000);
  const token = await service.insertOne({
    type,
    value,
    userId,
    expiresOn,
  });

  return `${token._id}.${secureToken}`;
};

const getToken = async (tokenId: string | undefined | null, type: TokenType): Promise<Token | null> => {
  if (!tokenId) return null;

  const token = await service.findOne({ _id: tokenId, type });

  if (type && token?.type !== type) return null;

  if (!token) return null;

  const now = new Date();

  if (token.expiresOn.getTime() <= now.getTime()) {
    await service.deleteOne({ _id: tokenId, type });
    return null;
  }

  return token;
};

const validateToken = async (value: string | undefined | null, type: TokenType): Promise<Token | null> => {
  if (!value) return null;

  const tokenParts = value.split('.');

  if (tokenParts.length !== 2) return null;

  const [tokenId, secret] = tokenParts;

  const token = await getToken(tokenId, type);

  const isValid = await securityUtil.verifyTokenHash(token?.value, secret);

  if (!isValid || !token) return null;

  const now = new Date();

  if (token.expiresOn.getTime() <= now.getTime()) {
    await service.deleteOne({ _id: tokenId, type });
    return null;
  }

  return token;
};

const invalidateToken = async (token?: string | null): Promise<void> => {
  if (!token) return;

  const tokenParts = token.split('.');

  if (tokenParts.length !== 2) return;

  const [tokenId] = tokenParts;

  await service.deleteOne({ _id: tokenId, type: TokenType.ACCESS });
};

const invalidateUserTokens = async (userId: string, type: TokenType): Promise<void> => {
  await service.deleteMany({ userId, type });
};

export const getUserActiveToken = async (userId: string, type: TokenType): Promise<Token | null> => {
  const token = await service.findOne({ userId, type });

  if (!token) return null;

  const now = new Date();

  if (token.expiresOn.getTime() <= now.getTime()) {
    await service.deleteOne({ _id: token._id });

    return null;
  }

  return token;
};

export default Object.assign(service, {
  createToken,
  validateToken,
  invalidateToken,
  invalidateUserTokens,
  getUserActiveToken,
});
