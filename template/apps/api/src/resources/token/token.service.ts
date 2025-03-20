import { securityUtil } from 'utils';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { tokenSchema } from 'schemas';
import { Token, TokenPayload, TokenType } from 'types';

const service = db.createService<Token>(DATABASE_DOCUMENTS.TOKENS, {
  schemaValidator: (obj) => tokenSchema.parseAsync(obj),
});

const createToken = async ({ userId, type }: TokenPayload): Promise<Token> => {
  const payload: TokenPayload = {
    type,
    userId,
  };

  const value = await securityUtil.generateJwtToken<TokenPayload>(payload);

  return service.insertOne({
    type,
    value,
    userId,
  });
};

const createAccessToken = async ({ userId }: Pick<TokenPayload, 'userId'>): Promise<string> => {
  const accessToken = await createToken({
    userId,
    type: TokenType.ACCESS,
  });

  return accessToken.value;
};

const findByJWTValue = async (value?: string | null): Promise<Token | null> => {
  if (!value) return null;

  const tokenPayload = await securityUtil.verifyJwtToken<TokenPayload>(value);

  if (!tokenPayload) return null;

  return service.findOne({ value });
};

export default Object.assign(service, {
  createAccessToken,
  findByJWTValue,
});
