import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
  token: Joi.string().required(),
  email: Joi.string().required(),
  invitedBy: Joi.string().required(),
});

export default schema;
