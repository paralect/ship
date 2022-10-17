import { z } from 'zod';

import { TokenType } from './token.types';

const schema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  type: z.nativeEnum(TokenType),
  value: z.string(),
  userId: z.string(),
  isShadow: z.boolean().nullable().optional(),
}).strict();

export default schema;
