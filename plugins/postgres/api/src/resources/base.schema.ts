import { timestamp, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const baseColumns = {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
};

export const paginationSchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),

  searchValue: z.string().optional(),

  sort: z
    .object({
      createdAt: z.enum(['asc', 'desc']).default('asc'),
    })
    .default({ createdAt: 'asc' }),
});

export const listResultSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    results: z.array(itemSchema),
    pagesCount: z.number(),
    count: z.number(),
  });
