import db from 'db';

import type { AppKoaContext, Next } from 'types';

function singularize(word: string): string {
  const endings: Record<string, string> = {
    ves: 'fe',
    ies: 'y',
    i: 'us',
    zes: 'ze',
    ses: 's',
    es: 'e',
    s: '',
  };

  return word.replace(new RegExp(`(${Object.keys(endings).join('|')})$`), (r) => endings[r]);
}

interface ShouldExistOptions {
  criteria?: (ctx: AppKoaContext) => Record<string, unknown>;
  ctxName?: string;
}

function shouldExist(resourceName: string, options: ShouldExistOptions = {}) {
  const singular = singularize(resourceName);
  const {
    criteria = (ctx: AppKoaContext) => ({ _id: ctx.params[`${singular}Id`] ?? ctx.params.id }),
    ctxName = singular,
  } = options;

  return async (ctx: AppKoaContext, next: Next): Promise<void> => {
    const service = db.services[resourceName];

    if (!service) {
      throw new Error(`shouldExist: service "${resourceName}" not found in db.services`);
    }

    const filter = criteria(ctx);

    const doc = await service.findOne(filter);

    if (!doc) {
      ctx.status = 404;
      ctx.body = { errors: { global: `${singular} not found` } };
      return;
    }

    ctx.state[ctxName] = doc;

    await next();
  };
}

export default shouldExist;
