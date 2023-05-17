import { z } from 'zod';
import { SortDirection } from '@paralect/node-mongo';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { userService } from 'resources/user';
import { docsService } from 'services';

import { schema } from './schema';
import docConfig from './doc';

type ValidatedData = Omit<z.infer<typeof schema>, 'sort'> & {
  sort: { [name: string]: SortDirection };
};

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
  docsService.registerDocs(docConfig);

  router.get('/', validateMiddleware(schema), handler);
};
