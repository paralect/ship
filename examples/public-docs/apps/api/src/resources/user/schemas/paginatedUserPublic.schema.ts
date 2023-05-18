import { docsService } from 'services';
import { z } from 'zod';

import schema from '../user.schema';

export const PaginatedUserPublicSchema = docsService.registerSchema(
  'PaginatedUserPublic', 
  z.object({
    items: z.array(schema),
    totalPages: z.number(),
    count: z.number(),
  }),
);
