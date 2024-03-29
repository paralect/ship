import { securityUtil } from 'utils';

import config from 'config';

import { TOKEN_SECURITY_EXPIRES_IN } from 'app-constants';
import { TokenType } from 'types';

const createToken = async (userId: string, type: TokenType, isShadow?: boolean) => {
  const payload = {
    tokenType: type,
    userId,
    isShadow: isShadow || null,
  }
  const accessToken = await securityUtil.generateJwtToken(payload, config.JWT_SECRET, TOKEN_SECURITY_EXPIRES_IN);

  return accessToken
};

const createAuthTokens = async ({ userId, isShadow }: { userId: string; isShadow?: boolean }) => {
  const accessTokenEntity = await createToken(userId, TokenType.ACCESS, isShadow);

  return {
    accessToken: accessTokenEntity,
  };
};

const findTokenByValue = async (token: string) => {
  const tokenEntity = await securityUtil.verifyJwtToken(token, config.JWT_SECRET);

  return (
    tokenEntity && {
      userId: tokenEntity.userId,
      isShadow: tokenEntity.isShadow,
    }
  );
};

export default {
  createAuthTokens,
  findTokenByValue,
};
