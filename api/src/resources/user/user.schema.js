const Joi = require('joi');

const userSchema = {
  _id: Joi.string(),
  createdOn: Joi.date(),
  firstName: Joi.string().allow(''),
  lastName: Joi.string(),
  email: Joi.string().email({ minDomainAtoms: 2 }),
  passwordHash: Joi.string(),
  passwordSalt: Joi.string(),
  signupToken: Joi.string(),
  resetPasswordToken: Joi.string()
    .allow(null)
    .default(null),
  isEmailVerified: Joi.boolean().default(false),
};

module.exports = obj => Joi.validate(obj, userSchema, { allowUnknown: true });
