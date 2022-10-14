import { z } from 'zod';
import { SortDirection } from '@paralect/node-mongo';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { userService } from 'resources/user';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  sort: z.object({
    createdOn: z.number(),
  }).default({ createdOn: -1 }),
  searchValue: z.string().default(''),
});

type ValidatedData = Omit<z.infer<typeof schema>, 'sort'> & {
  sort: { [name: string]: SortDirection };
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    perPage, page, sort, searchValue,
  } = ctx.validatedData;

  const validatedSearch = searchValue.split('\\').join('\\\\').split('.').join('\\.');
  const regExp = new RegExp(validatedSearch, 'gi');

  const users = await userService.find(
    {
      $or: [
        { firstName: { $regex: regExp } },
        { lastName: { $regex: regExp } },
        { email: { $regex: regExp } },
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
