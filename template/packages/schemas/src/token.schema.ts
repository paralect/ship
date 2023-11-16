import { z } from 'zod';

import { TokenType } from 'enums';

import dbSchema from './db.schema';

export const tokenSchema = dbSchema.extend({
  type: z.nativeEnum(TokenType),
  value: z.string(),
  userId: z.string(),
  isShadow: z.boolean().nullable().optional(),
}).strict();
