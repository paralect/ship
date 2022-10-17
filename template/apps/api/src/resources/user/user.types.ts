import { z } from 'zod';

import schema from './user.schema';

export type User = z.infer<typeof schema>;
