import { z } from 'zod';

import { userSchema } from 'schemas';

export type User = z.infer<typeof userSchema>;
