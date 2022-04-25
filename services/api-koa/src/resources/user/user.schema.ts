import Joi from 'joi';

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
  lastRequest: Joi.date(),
  avatarUrl: Joi.string()
    .allow(null),
});

export default schema;
