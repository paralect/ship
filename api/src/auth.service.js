const jwt = require('jsonwebtoken');
const config = require('config');

const { logger } = global;

module.exports.createAuthToken = ({ userId }) => {
  const payload = {
    _id: userId,
  };

  return jwt.sign(payload, config.jwtSecret, {});
};

module.exports.decodeToken = (token) => {
  let res;

  try {
    res = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    logger.warn('Invalid json web token', err);
  }

  return res;
};
