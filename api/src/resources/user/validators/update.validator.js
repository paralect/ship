const Joi = require('helpers/joi.adapter');

const userService = require('resources/user/user.service');

const schema = {
  firstName: Joi.string()
    .trim()
    .options({
      language: {
        any: { empty: '!!Your first name must be longer than 1 letter' },
      },
    }),
  lastName: Joi.string()
    .trim()
    .options({
      language: {
        any: { empty: '!!Your last name must be longer than 1 letter' },
      },
    }),
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .trim()
    .lowercase()
    .options({
      language: {
        string: { email: '!!Please enter a valid email address' },
        any: { empty: '!!Email is required' },
      },
    }),
};

const validateFunc = async (data, pesistentData) => {
  const userExist = await userService.exists({
    _id: { $ne: pesistentData.state.user._id },
    email: data.email,
  });
  const errors = [];

  if (userExist) {
    errors.push({ email: 'This email is already in use.' });
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
