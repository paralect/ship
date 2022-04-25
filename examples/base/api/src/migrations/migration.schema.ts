import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  version: Joi.number()
    .required(),
});

export default schema;
