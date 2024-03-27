import { securityUtil } from 'utils';

import db from 'db';

import { DATABASE_DOCUMENTS, TOKEN_SECURITY_LENGTH } from 'app-constants';
import { tokenSchema } from 'schemas';
import { Token, TokenType } from 'types';

const service = db.createService<Token>(DATABASE_DOCUMENTS.TOKENS, {
  schemaValidator: (obj) => tokenSchema.parseAsync(obj),
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

const createAuthTokens = async ({ userId, isShadow }: { userId: string; isShadow?: boolean }) => {
  const accessTokenEntity = await createToken(userId, TokenType.ACCESS, isShadow);

  return {
    accessToken: accessTokenEntity.value,
  };
};

const findTokenByValue = async (token: string) => {
  const tokenEntity = await service.findOne({ value: token });

  return (
    tokenEntity && {
      userId: tokenEntity.userId,
      isShadow: tokenEntity.isShadow,
    }
  );
};

const removeAuthTokens = async (accessToken: string) => service.deleteMany({ value: { $in: [accessToken] } });

export default Object.assign(service, {
  createAuthTokens,
  findTokenByValue,
  removeAuthTokens,
});
