import { securityUtil } from 'utils';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { tokenSchema } from 'schemas';
import { Token, TokenType } from 'types';

type TokenPayload = Pick<Token, 'userId' | 'isShadow'> & { tokenType: TokenType };

const service = db.createService<Token>(DATABASE_DOCUMENTS.TOKENS, {
  schemaValidator: (obj) => tokenSchema.parseAsync(obj),
});

const createToken = async (userId: string, type: TokenType, isShadow?: boolean) => {
  const payload: TokenPayload = {
    tokenType: type,
    userId,
    isShadow: isShadow || null,
  };

  const value = await securityUtil.generateJwtToken<TokenPayload>(payload);

  return service.insertOne({
    type,
    value,
    userId,
    isShadow: isShadow || null,
  });
};

const createAuthTokens = async ({ userId, isShadow }: { userId: string; isShadow?: boolean }) => {
  const accessTokenEntity = await createToken(userId, TokenType.ACCESS, isShadow);

  return {
    accessToken: accessTokenEntity.value,
  };
};

const findTokenByValue = async (token?: string | null): Promise<TokenPayload | null> => {
  if (!token) return null;

  const tokenEntity = await securityUtil.verifyJwtToken<TokenPayload>(token);

  if (!tokenEntity) return null;

  return tokenEntity;
};

const removeAuthTokens = async (accessToken: string) => service.deleteMany({ value: accessToken });

export default Object.assign(service, {
  createAuthTokens,
  findTokenByValue,
  removeAuthTokens,
});
