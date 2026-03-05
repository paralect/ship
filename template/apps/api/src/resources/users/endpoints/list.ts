import { paginationSchema, userPublicSchema } from 'shared';
import { z } from 'zod';

import { userService } from 'resources/users';

import createEndpoint from 'routes/createEndpoint';

import type { NestedKeys } from 'types';

const schema = paginationSchema.extend({
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
});

export default createEndpoint({
  method: 'get',
  path: '/',
  schema,

  async handler(ctx) {
    type User = z.infer<typeof userPublicSchema>;
    const { perPage, page, sort, searchValue, filter } = ctx.validatedData;

    const filterOptions = [];

    if (searchValue) {
      const searchFields: NestedKeys<User>[] = ['firstName', 'lastName', 'email'];

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
  },
});
