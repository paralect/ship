import Joi from 'joi';
import { TokenType } from 'resources/token/token.types';

const schema = Joi.object({
  _id: Joi.string(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
  type: Joi.string()
    .valid(...Object.values(TokenType))
    .required(),
  value: Joi.string()
    .required(),
  userId: Joi.string()
    .required(),
});

export default schema;
