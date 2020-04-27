const qrCode = require('qrcode');
const speakeasy = require('speakeasy');
const config = require('config');

exports.generateAccountName = userAccountName => `${config.applicationName}:${userAccountName}`;

exports.generateSecret = (accountName) => {
  const secret = speakeasy.generateSecret({ name: accountName });

  return secret.base32;
};

exports.generateQrCode = (secret, accountName) => {
  const otpauthURL = speakeasy.otpauthURL({ secret, label: encodeURIComponent(accountName), encoding: 'base32' });

  return qrCode.toDataURL(otpauthURL);
};

exports.isTwoFaCodeValid = (twoFaCode, twoFaSecret) => speakeasy.totp.verify({
  secret: twoFaSecret,
  encoding: 'base32',
  token: twoFaCode,
});
