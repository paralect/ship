import { securityUtil } from 'utils';

import db from 'db';

import {
  ACCESS_TOKEN_ACTIVITY_CHECK_INTERVAL_SECONDS,
  ACCESS_TOKEN_INACTIVITY_TIMEOUT_SECONDS,
  DATABASE_DOCUMENTS,
} from 'app-constants';
import { tokenSchema } from 'schemas';
import { Token, TokenPayload, TokenType } from 'types';

const service = db.createService<Token>(DATABASE_DOCUMENTS.TOKENS, {
  schemaValidator: (obj) => tokenSchema.parseAsync(obj),
});

const createAccessToken = async ({ userId }: Pick<TokenPayload, 'userId'>): Promise<string> => {
  const secureToken = await securityUtil.generateSecureToken();

  const value = await securityUtil.hashAccessToken(secureToken);

  const accessToken = await service.insertOne({
    type: TokenType.ACCESS,
    value,
    userId,
    lastVerifiedOn: new Date(),
  });

  return `${accessToken._id}.${secureToken}`;
};

const getAccessToken = async (tokenId?: string | null): Promise<Token | null> => {
  if (!tokenId) return null;

  const token = await service.findOne({ _id: tokenId, type: TokenType.ACCESS });

  if (!token) return null;

  const now = new Date();

  if (now.getTime() - token.lastVerifiedOn.getTime() >= ACCESS_TOKEN_INACTIVITY_TIMEOUT_SECONDS * 1000) {
    await service.deleteOne({ _id: tokenId, type: TokenType.ACCESS });

    return null;
  }

  return token;
};

const validateAccessToken = async (value?: string | null): Promise<Token | null> => {
  if (!value) return null;

  const tokenParts = value.split('.');

  if (tokenParts.length !== 2) return null;

  const [tokenId, secret] = tokenParts;

  const token = await getAccessToken(tokenId);

  const isValid = await securityUtil.verifyAccessToken(token?.value, secret);

  if (!isValid) return null;
  if (!token) return null;

  const now = new Date();

  if (now.getTime() - token.lastVerifiedOn.getTime() >= ACCESS_TOKEN_ACTIVITY_CHECK_INTERVAL_SECONDS * 1000) {
    token.lastVerifiedOn = now;

    await service.updateOne({ value, type: TokenType.ACCESS }, () => ({ lastVerifiedOn: now }));
  }

  return token;
};

const invalidateAccessToken = async (accessToken?: string | null): Promise<void> => {
  if (!accessToken) return;

  const tokenParts = accessToken.split('.');

  if (tokenParts.length !== 2) return;

  const [tokenId] = tokenParts;

  await service.deleteOne({ _id: tokenId, type: TokenType.ACCESS });
};

export default Object.assign(service, {
  createAccessToken,
  validateAccessToken,
  invalidateAccessToken,
});
