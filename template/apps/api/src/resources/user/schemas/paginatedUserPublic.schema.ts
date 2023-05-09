import schema from '../user.schema';
import { docsService } from 'services';
import { z } from 'zod';

export const PaginatedUserPublicSchema = z.object({
  items: z.array(schema),
  totalPages: z.number(),
  count: z.number(),
});

docsService.registerSchema('PaginatedUserPublic', PaginatedUserPublicSchema);
