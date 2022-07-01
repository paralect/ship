import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  passwordHash: Joi.string().required(),
  signupToken: Joi.string().required().allow(null),
  resetPasswordToken: Joi.string().allow(null),
  isEmailVerified: Joi.boolean().required().default(false),
  avatarUrl: Joi.string().allow(null),
  lastRequest: Joi.date(),
});

export default schema;
