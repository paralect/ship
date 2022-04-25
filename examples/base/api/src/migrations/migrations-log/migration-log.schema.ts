import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  startTime: Joi.date()
    .required(),
  finishTime: Joi.date(),
  status: Joi.string()
    .required(),
  error: Joi.string(),
  errorStack: Joi.string(),
  duration: Joi.string(),
  migrationVersion: Joi.number()
    .required(),
});

export default schema;
