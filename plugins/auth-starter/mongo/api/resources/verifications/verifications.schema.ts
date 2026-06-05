import { z } from 'zod';

import { dbSchema } from '@/resources/base.schema';

const schema = dbSchema.extend({
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.date(),
});

export default schema;

export type Verification = z.infer<typeof schema>;
