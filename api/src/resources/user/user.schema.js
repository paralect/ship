const Joi = require('joi');

const schema = Joi.object({
  _id: Joi.string(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  firstName: Joi.string()
    .required(),
  lastName: Joi.string()
    .required(),
  email: Joi.string()
    .email()
    .required(),
  passwordHash: Joi.string()
    .allow(null),
  signupToken: Joi.string()
    .allow(null),
  resetPasswordToken: Joi.string()
    .allow(null),
  isEmailVerified: Joi.boolean()
    .default(false),
  oauth: Joi.object()
    .keys({
      google: Joi.boolean().default(false),
    })
    .required(),
  lastRequest: Joi.date(),
  avatarFileKey: Joi.string()
    .allow(null),
});

module.exports = (obj) => schema.validate(obj, { allowUnknown: false });
