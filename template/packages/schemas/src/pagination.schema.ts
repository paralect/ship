import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),

  searchValue: z.string().optional(),

  sort: z
    .object({
      createdOn: z.enum(['asc', 'desc']).default('asc'),
    })
    .default({}),
});
