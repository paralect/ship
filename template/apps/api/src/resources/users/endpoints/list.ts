import { admin } from 'procedures';
import { z } from 'zod';

import { listResultSchema, paginationSchema } from 'resources/base.schema';

import type { NestedKeys } from 'types';

import { userPublicSchema } from '../user.schema';
import { userService } from '..';

const publicUserOutput = userPublicSchema;

export default admin
  .input(
    paginationSchema.extend({
      filter: z
        .object({
          createdOn: z
            .object({
              startDate: z.coerce.date().optional(),
              endDate: z.coerce.date().optional(),
            })
            .optional(),
        })
        .optional(),
      sort: z
        .object({
          firstName: z.enum(['asc', 'desc']).optional(),
          lastName: z.enum(['asc', 'desc']).optional(),
          createdOn: z.enum(['asc', 'desc']).default('asc'),
        })
        .default({ createdOn: 'asc' }),
    }),
  )
  .output(listResultSchema(publicUserOutput))
  .handler(async ({ input }) => {
    type UserPublic = z.infer<typeof userPublicSchema>;
    const { perPage, page, sort, searchValue, filter } = input;

    const filterOptions = [];

    if (searchValue) {
      const searchFields: NestedKeys<UserPublic>[] = ['firstName', 'lastName', 'email'];

      filterOptions.push({
        $or: searchFields.map((field) => ({ [field]: { $regex: searchValue } })),
      });
    }

    if (filter) {
      const { createdOn, ...otherFilters } = filter;

      if (createdOn) {
        const { startDate, endDate } = createdOn;

        filterOptions.push({
          createdOn: {
            ...(startDate && { $gte: startDate }),
            ...(endDate && { $lt: endDate }),
          },
        });
      }

      Object.entries(otherFilters).forEach(([key, value]) => {
        filterOptions.push({ [key]: value });
      });
    }

    const result = await userService.find(
      { ...(filterOptions.length && { $and: filterOptions }) },
      { page, perPage },
      { sort },
    );

    return { ...result, results: result.results.map((u) => userService.getPublic(u)) };
  });
