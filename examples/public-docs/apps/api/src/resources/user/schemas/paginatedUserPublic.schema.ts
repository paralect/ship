import schema from '../user.schema';
import { docsService } from 'services';
import { z } from 'zod';

export const PaginatedUserPublicSchema = docsService.registerSchema(
  'PaginatedUserPublic', 
  z.object({
    items: z.array(schema),
    totalPages: z.number(),
    count: z.number(),
  }),
);
