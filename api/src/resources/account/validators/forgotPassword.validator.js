const Joi = require('helpers/joi.adapter');
const userService = require('resources/user/user.service');

const schema = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .trim()
    .lowercase()
    .options({
      language: {
        any: { empty: '!!Email is required' },
        string: { email: '!!Please enter a valid email address' },
      },
    }),
};

const validateFunc = async (data) => {
  const userExists = await userService.exists({ email: data.email });
  const errors = [];
  if (!userExists) {
    errors.push({
      email: `Couldn't find account associated with ${data.email}. Please try again`,
    });
    return { errors };
  }

  return {
    value: data,
    errors,
  };
};

module.exports = [
  Joi.validate(schema),
  validateFunc,
];
