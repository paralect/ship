import db from 'db';
import securityUtil from 'utils/security.util';
import { DATABASE_DOCUMENTS, TOKEN_SECURITY_LENGTH } from 'app.constants';
import schema from './token.schema';
import { Token, TokenType } from './token.types';

const service = db.createService<Token>(DATABASE_DOCUMENTS.TOKENS, { schema });

const createToken = async (userId: string, type: TokenType) => {
  const value = await securityUtil.generateSecureToken(TOKEN_SECURITY_LENGTH);

  return service.create({
    type, value, userId,
  });
};

const createAuthTokens = async ({
  userId,
}: { userId: string }) => {
  const accessTokenEntity = await createToken(userId, TokenType.ACCESS);

  return {
    accessToken: accessTokenEntity.value,
  };
};

const findTokenByValue = async (token: string) => {
  const tokenEntity = await service.findOne({ value: token });

  return tokenEntity && {
    userId: tokenEntity.userId,
  };
};

const removeAuthTokens = async (accessToken: string) => {
  return service.remove({ value: { $in: [accessToken] } });
};

export default Object.assign(service, {
  createAuthTokens,
  findTokenByValue,
  removeAuthTokens,
});
