import { z } from 'zod';

export const schema = z.object({
  page: z.string().transform(Number).default('1').openapi({ type: 'string' }),
  perPage: z.string().transform(Number).default('10').openapi({ type: 'string' }),
  sort: z.object({
    createdOn: z.string(),
  }).default({ createdOn: 'desc' }),
  filter: z.object({
    createdOn: z.object({
      sinceDate: z.string(),
      dueDate: z.string(),
    }).nullable().default(null),
  }).nullable().default(null),
  searchValue: z.string().default(''),
});
