const db = require('db');
const securityUtil = require('security.util');
const { DATABASE_DOCUMENTS, TOKEN_SECURITY_LENGTH, TOKEN_TYPES } = require('app.constants');

const validateSchema = require('./token.schema');

const service = db.createService(DATABASE_DOCUMENTS.TOKENS, { validate: validateSchema });

const createToken = async (userId, type) => {
  const value = await securityUtil.generateSecureToken(TOKEN_SECURITY_LENGTH);

  return service.create({
    type, value, userId, isShadow: false,
  });
};

service.createAuthTokens = async ({ userId }) => {
  const accessTokenEntity = await createToken(userId, TOKEN_TYPES.ACCESS);

  return {
    accessToken: accessTokenEntity.value,
  };
};

service.getUserDataByToken = async (token) => {
  const tokenEntity = await service.findOne({ value: token });

  return tokenEntity && {
    userId: tokenEntity.userId,
    isShadow: tokenEntity.isShadow,
  };
};

service.removeAuthTokens = async (accessToken) => {
  return service.remove({ value: { $in: [accessToken] } });
};

module.exports = service;
