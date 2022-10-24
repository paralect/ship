import { z } from 'zod';

import schema from './subscription.schema';

export type Subscription = z.infer<typeof schema>;
