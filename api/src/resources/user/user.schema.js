const Joi = require('joi');

const userSchema = {
  _id: Joi.string(),
  createdOn: Joi.date(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email({ minDomainAtoms: 2 }),
  passwordHash: Joi.string(),
  signupToken: Joi.string(),
  resetPasswordToken: Joi.string()
    .allow(null)
    .default(null),
  isEmailVerified: Joi.boolean().default(false),
  oauth: Joi.object().keys({
    google: Joi.boolean().default(false),
    facebookId: Joi.string(),
  }),
};

module.exports = obj => Joi.validate(obj, userSchema, { allowUnknown: true });
