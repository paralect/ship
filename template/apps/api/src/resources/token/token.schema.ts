import Joi from 'joi';

import { TokenType } from './token.types';

const schema = Joi.object({
  _id: Joi.string().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date().allow(null),
  type: Joi.string().valid(...Object.values(TokenType)).required(),
  value: Joi.string().required(),
  userId: Joi.string().required(),
  isShadow: Joi.bool().allow(null),
});

export default schema;
