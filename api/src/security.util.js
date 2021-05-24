const crypto = require('crypto');
const bcrypt = require('bcrypt');
const util = require('util');

const randomBytes = util.promisify(crypto.randomBytes, crypto);
const bcryptHash = util.promisify(bcrypt.hash, bcrypt);
const compare = util.promisify(bcrypt.compare, bcrypt);

/**
 * @desc Generates random string, useful for creating secure tokens
 *
 * @return {string} - random string
 */
exports.generateSecureToken = async (tokenLength = 48) => {
  const buf = await randomBytes(tokenLength);
  return buf.toString('hex');
};

/**
 * @desc Generate hash from any string. Could be used to generate a hash from password
 *
 * @param text {string} - a text to produce hash from
 * @return {Promise} - a hash from input text
 */
exports.getHash = (text) => {
  return bcryptHash(text, 10);
};

/**
 * @desc Compares if text and hash are equal
 *
 * @param text {string} - a text to compare with hash
 * @param hash {string} - a hash to compare with text
 * @return {Promise} - are hash and text equal
 */
exports.compareTextWithHash = (text, hash) => {
  return compare(text, hash);
};
