const Joi = require('joi');

const { TOKEN_TYPES } = require('app.constants');

const schema = Joi.object({
  _id: Joi.string(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  type: Joi.string()
    .valid(TOKEN_TYPES.ACCESS)
    .required(),
  value: Joi.string()
    .required(),
  userId: Joi.string()
    .required(),
  isShadow: Joi.boolean(),
});

module.exports = (obj) => schema.validate(obj, { allowUnknown: false });
