import { z } from 'zod';

import schema from './invite.schema';

export type Invite = z.infer<typeof schema>;
