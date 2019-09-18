const qrCode = require('qrcode');
const speakeasy = require('speakeasy');

exports.generateTwoFaSetupQrCode = (twoFaUserSecret, username) => {
  const url = speakeasy.otpauthURL({ secret: twoFaUserSecret, label: username });

  return qrCode.toDataURL(url);
};

exports.generateTwoFaSecret = () => {
  const secret = speakeasy.generateSecret();

  return secret.base32;
};

exports.isTwoFaCodeValid = (twoFaCode, twoFaSecret) => speakeasy.totp.verify({
  secret: twoFaSecret,
  encoding: 'base32',
  token: twoFaCode,
});