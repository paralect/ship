const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('config');

const { logger } = global;

exports.createAuthToken = ({ userId }) => {
  const payload = {
    _id: userId,
  };

  return jwt.sign(payload, config.jwt.secret, _.pick(config.jwt, ['audience', 'issuer']));
};

exports.decodeToken = (token) => {
  let res;

  try {
    res = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    logger.warn('Invalid json web token', err);
  }

  return res;
};
