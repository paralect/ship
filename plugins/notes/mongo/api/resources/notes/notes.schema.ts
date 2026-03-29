import { z } from 'zod';

import { dbSchema } from '@/resources/base.schema';

const schema = dbSchema.extend({
  text: z.string().min(1).max(1000),
  userId: z.string(),
});

export default schema;

export const indexes = [
  { fields: { userId: 1 }, options: {} },
] as const;
