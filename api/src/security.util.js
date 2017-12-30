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
exports.generateSecureToken = async () => {
  const buf = await randomBytes(48);
  return buf.toString('hex');
};

/**
 * @desc Generate hash from any string. Could be used to generate a hash from password
 *
 * @param text {string} - a text to produce hash from
 * @param salt {string}
 * @return {Promise} - a hash from input text
 */
exports.getHash = (text, salt = '') => {
  return bcryptHash(`${text[0]}${salt}${text.slice(1)}`, 10);
};

/**
 * @desc Generate salt
 * @return {string}
 */
exports.generateSalt = async () => {
  const buf = await randomBytes(16);
  return buf.toString('hex');
};

/**
 * @desc Compares if text and hash are equal
 *
 * @param text {string} - a text to compare with hash
 * @param hash {string} - a hash to compare with text
 * @param salt {string} - a salt which will add to password
 * @return {Promise} - are hash and text equal
 */
exports.compareTextWithHash = (text, hash, salt = '') => {
  return compare(`${text[0]}${salt}${text.slice(1)}`, hash);
};

/**
 * @desc Generate salt using sha256
 *
 * @param {string} text
 * @param {string} shaSecret
 * @return {string}
 */
exports.generateShaHash = (text, shaSecret) => {
  return crypto
    .createHmac('sha256', shaSecret)
    .update(text)
    .digest('hex');
};
