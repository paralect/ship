import { securityUtil } from 'utils';

import { TOKEN_SECURITY_LENGTH } from 'app-constants';
import { database, Prisma, TokenType } from 'database';

const createToken = async (userId: number, type: TokenType, isShadow?: boolean) => {
  const value = await securityUtil.generateSecureToken(TOKEN_SECURITY_LENGTH);

  return database.token.create({
    data: {
      type,
      value,
      userId,
      isShadow,
    },
  });
};

const createAuthTokens = async (user: { userId: number; isShadow?: boolean }) => {
  const accessTokenEntity = await createToken(user.userId, TokenType.ACCESS, user.isShadow);

  return {
    accessToken: accessTokenEntity.value,
  };
};

const findTokenByValue = async (token: string) =>
  database.token.findFirst({
    where: { value: token },
    select: { userId: true, isShadow: true },
  });

const removeAuthTokens = async (accessToken: string) =>
  database.token.deleteMany({
    where: {
      value: accessToken,
    },
  });

const invalidateUserTokens = async (userId: number, tx?: Prisma.TransactionClient) => {
  const client = tx || database;
  return client.token.deleteMany({ where: { userId } });
};

export default Object.assign(database, {
  createAuthTokens,
  findTokenByValue,
  removeAuthTokens,
  invalidateUserTokens,
});
