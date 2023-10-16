import { z } from 'zod';

import { tokenSchema } from 'schemas';

export type Token = z.infer<typeof tokenSchema>;
