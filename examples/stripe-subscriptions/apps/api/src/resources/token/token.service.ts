import db from 'db';
import { securityUtil } from 'utils';
import { DATABASE_DOCUMENTS, TOKEN_SECURITY_LENGTH } from 'app.constants';

import schema from './token.schema';
import { Token, TokenType } from './token.types';

const service = db.createService<Token>(DATABASE_DOCUMENTS.TOKENS, {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

const createToken = async (userId: string, type: TokenType, isShadow?: boolean) => {
  const value = await securityUtil.generateSecureToken(TOKEN_SECURITY_LENGTH);

  return service.insertOne({
    type,
    value,
    userId,
    isShadow: isShadow || null,
  });
};

const createAuthTokens = async ({
  userId,
  isShadow,
}: { userId: string, isShadow?: boolean }) => {
  const accessTokenEntity = await createToken(userId, TokenType.ACCESS, isShadow);

  return {
    accessToken: accessTokenEntity.value,
  };
};

const findTokenByValue = async (token: string) => {
  const tokenEntity = await service.findOne({ value: token });

  return tokenEntity && {
    userId: tokenEntity.userId,
    isShadow: tokenEntity.isShadow,
  };
};

const removeAuthTokens = async (accessToken: string) => {
  return service.deleteMany({ value: { $in: [accessToken] } });
};

export default Object.assign(service, {
  createAuthTokens,
  findTokenByValue,
  removeAuthTokens,
});
