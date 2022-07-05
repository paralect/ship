import Joi from 'joi';

import { TokenType } from './token.types';

const schema = Joi.object({
  _id: Joi.string().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
  type: Joi.string().valid(...Object.values(TokenType)).required(),
  value: Joi.string().required(),
  userId: Joi.string().required(),
});

export default schema;
