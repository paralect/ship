import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * @desc Generates random string, useful for creating secure tokens
 *
 * @return {string} - random string
 */
export const generateSecureToken = async (tokenLength = 48) => {
  const buffer = crypto.randomBytes(tokenLength);

  return buffer.toString('hex');
};

/**
 * @desc Generate hash from any string. Could be used to generate a hash from password
 *
 * @param text {string} - a text to produce hash from
 * @return {Promise} - a hash from input text
 */
export const getHash = (text: string) => {
  return bcrypt.hash(text, 10);
};

/**
 * @desc Compares if text and hash are equal
 *
 * @param text {string} - a text to compare with hash
 * @param hash {string} - a hash to compare with text
 * @return {Promise} - are hash and text equal
 */
export const compareTextWithHash = (text: string, hash: string) => {
  return bcrypt.compare(text, hash);
};

export default {
  generateSecureToken,
  getHash,
  compareTextWithHash,
};
