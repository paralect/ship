import { z } from 'zod';

import { AppKoaContext, AppRouter } from 'types';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  sort: z.object({
    createdOn: z.enum(['asc', 'desc']),
  }).default({ createdOn: 'desc' }),
  filter: z.object({
    createdOn: z.object({
      sinceDate: z.string(),
      dueDate: z.string(),
    }).nullable().default(null),
  }).nullable().default(null),
  searchValue: z.string().default(''),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    perPage, page, sort, searchValue, filter,
  } = ctx.validatedData;

  const validatedSearch = searchValue.split('\\').join('\\\\').split('.').join('\\.');
  const regExp = new RegExp(validatedSearch, 'gi');

  const users = await userService.find(
    {
      $and: [
        {
          $or: [
            { firstName: { $regex: regExp } },
            { lastName: { $regex: regExp } },
            { email: { $regex: regExp } },
            { createdOn: {} },
          ],
        },
        filter?.createdOn ? {
          createdOn: {
            $gte: new Date(filter.createdOn.sinceDate as string),
            $lt: new Date(filter.createdOn.dueDate as string),
          },
        } : {},
      ],
    },
    { page, perPage },
    { sort },
  );

  ctx.body = {
    items: users.results,
    totalPages: users.pagesCount,
    count: users.count,
  };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), handler);
};
