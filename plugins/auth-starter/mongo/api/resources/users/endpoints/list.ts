import { z } from 'zod';

import { publicSchema } from '../users.schema';

import db from '@/db';
import { isAdmin } from '@/procedures';
import { listResultSchema, paginationSchema } from '@/resources/base.schema';


export default isAdmin
  .route({ method: 'GET', path: '/users' })
  .input(
    paginationSchema.extend({
      filter: z
        .object({
          createdAt: z
            .object({
              startDate: z.coerce.date().optional(),
              endDate: z.coerce.date().optional(),
            })
            .optional(),
        })
        .optional(),
      sort: z
        .object({
          fullName: z.enum(['asc', 'desc']).optional(),
          createdAt: z.enum(['asc', 'desc']).default('asc'),
        })
        .default({ createdAt: 'asc' }),
    }),
  )
  .output(listResultSchema(publicSchema))
  .handler(async ({ input }) => {
    type UserPublic = z.infer<typeof publicSchema>;
    const { perPage, page, sort, searchValue, filter } = input;

    const filterOptions = [];

    if (searchValue) {
      const searchFields: (keyof UserPublic)[] = ['fullName', 'email'];

      filterOptions.push({
        $or: searchFields.map((field) => ({ [field]: { $regex: searchValue } })),
      });
    }

    if (filter) {
      const { createdAt, ...otherFilters } = filter;

      if (createdAt) {
        const { startDate, endDate } = createdAt;

        filterOptions.push({
          createdAt: {
            ...(startDate && { $gte: startDate }),
            ...(endDate && { $lt: endDate }),
          },
        });
      }

      Object.entries(otherFilters).forEach(([key, value]) => {
        filterOptions.push({ [key]: value });
      });
    }

    const result = await db.users.find(
      { ...(filterOptions.length && { $and: filterOptions }) },
      { page, perPage },
      { sort },
    );

    return result;
  });
