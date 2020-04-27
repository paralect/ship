const Joi = require('helpers/joi.adapter');
const twoFaHelper = require('helpers/twoFa');

const schema = {
  verificationCode: Joi.string()
    .trim()
    .options({
      language: {
        any: { empty: '!!Verification code is required' },
      },
    }),
};

const validationFunction = async (data, persistentData) => {
  const errors = [];
  const { twoFa: { isEnabled: isTwoFaEnabled, secret: twoFaSecret } } = persistentData.state.user;

  if (isTwoFaEnabled) {
    errors.push({ twoFa: 'Two factor authentication is already enabled' });
    return { errors };
  }

  const isTwoFaVerificationCodeValid = twoFaHelper
    .isTwoFaCodeValid(data.verificationCode, twoFaSecret);

  if (!isTwoFaVerificationCodeValid) {
    errors.push({ verificationCode: 'Verification code is incorrect' });
    return { errors };
  }

  return {
    value: {},
    errors,
  };
};

module.exports = [
  Joi.validate(schema),
  validationFunction,
];
