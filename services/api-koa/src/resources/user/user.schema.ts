import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date().allow(null),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  passwordHash: Joi.string().allow(null),
  signupToken: Joi.string().allow(null),
  resetPasswordToken: Joi.string().allow(null),
  isEmailVerified: Joi.boolean().required().default(false),
  avatarUrl: Joi.string().allow(null),
  lastRequest: Joi.date(),
  oauth: Joi.object().keys({
    google: Joi.boolean().default(false),
  }),
});

export default schema;
