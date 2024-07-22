import { openAIService } from 'resources/open-ai';

import { AppKoaContext, AppRouter } from 'types';

const sortBy = 'lastMessageOn';
const sortOrder = -1;

async function handler(ctx: AppKoaContext) {
  const {
    user: { _id: userId },
  } = ctx.state;

  const { results, count } = await openAIService.find(
    {
      userId,
    },
    {},
    {
      sort: { [sortBy]: sortOrder },
    },
  );

  ctx.body = {
    results,
    count,
  };
}

export default (router: AppRouter) => {
  router.get('/list', handler);
};
