import { z } from 'zod';

export const dbSchema = z.object({
  id: z.string().uuid(),

  createdOn: z.date().nullable(),
  updatedOn: z.date().nullable(),
  deletedOn: z.date().nullable(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),

  searchValue: z.string().optional(),

  sort: z
    .object({
      createdOn: z.enum(['asc', 'desc']).default('asc'),
    })
    .default({ createdOn: 'asc' }),
});

export const listResultSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    results: z.array(itemSchema),
    pagesCount: z.number(),
    count: z.number(),
  });
