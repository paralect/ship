const Joi = require('helpers/joi.adapter');

const userService = require('resources/user/user.service');

const schema = {
  token: Joi.string(),
  password: Joi.string()
    .trim()
    .min(6)
    .max(20)
    .options({
      language: {
        string: {
          min: '!!Password must be 6-20 characters',
          max: '!!Password must be 6-20 characters',
        },
        any: { empty: '!!Password is required' },
      },
    }),
};
const validateFunc = async (data) => {
  const user = await userService.findOne({ resetPasswordToken: data.token });
  const errors = [];

  if (!user) {
    errors.push({ token: 'Password reset link has expired or invalid' });
    return { errors };
  }


  return {
    value: {
      userId: user._id,
      password: data.password,
    },
    errors,
  };
};

module.exports = [
  Joi.validate(schema),
  validateFunc,
];
