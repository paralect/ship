const Joi = require('helpers/joi.adapter');

const userService = require('resources/user/user.service');

const schema = {
  token: Joi.string().options({
    language: {
      any: { empty: '!!Token is required' },
    },
  }),
};

const validateFunc = async (data) => {
  const user = await userService.findOne({ signupToken: data.token });
  const errors = [];
  if (!user) {
    errors.push({ token: 'Token is invalid' });
    return {
      errors,
    };
  }

  return {
    value: {
      userId: user._id,
    },
    errors,
  };
};

module.exports = [
  Joi.validate(schema),
  validateFunc,
];
