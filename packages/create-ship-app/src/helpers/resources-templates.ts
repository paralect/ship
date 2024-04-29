import pluralize from 'pluralize';

const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

export const serviceContent = (name: string) => `import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { ${name}Schema } from 'schemas';
import { ${capitalizeFirstLetter(name)} } from 'types';

const service = db.createService<${capitalizeFirstLetter(name)}>(DATABASE_DOCUMENTS.${pluralize
  .plural(name.toUpperCase())}, {
  schemaValidator: (obj) => ${name}Schema.parseAsync(obj),
});

export default service;
`;

export const routesContent = () => `import { routeUtil } from 'utils';

import create from './actions/create';
import get from './actions/get';
import update from './actions/update';
import remove from './actions/remove';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([create, get, update, remove]);

const adminRoutes = routeUtil.getRoutes([]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
`;

export const indexContent = (name: string) => `import ${name}Routes from './${name}.routes';
import ${name}Service from './${name}.service';

export { ${name}Routes, ${name}Service };
`;

export const actionCreateContent = (name: string) => `import { z } from 'zod';

import { ${name}Service } from 'resources/${name}';

import { AppKoaContext, AppRouter } from 'types';

import { validateMiddleware } from 'middlewares';

const schema = z.object({
  name: z.string().min(1, 'Please enter name').max(40),
}).strict();

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { name } = ctx.validatedData;

  const created${capitalizeFirstLetter(name)} = await ${name}Service.insertOne({ name });

  ctx.body = created${capitalizeFirstLetter(name)};
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), handler);
};
`;

export const actionGetContent = (name: string) => `import { AppKoaContext, AppRouter } from 'types';

import { ${name}Service } from 'resources/${name}';

type ValidatedData = never;
type Request = {
  params: {
    id: string;
  };
};

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const ${name} = await ${name}Service.findOne({ _id: ctx.request.params.id });

  ctx.body = ${name};
}

export default (router: AppRouter) => {
  router.get('/:id', handler);
};
`;

export const actionUpdateContent = (name: string) => `import { z } from 'zod';

import { ${name}Service } from 'resources/${name}';

import { AppKoaContext, AppRouter, Next } from 'types';

import { validateMiddleware } from 'middlewares';

const schema = z.object({
  name: z.string().min(1, 'Please enter name').max(40),
});

type ValidatedData = z.infer<typeof schema>;
type Request = {
  params: {
    id: string;
  };
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const { id } = ctx.request.params;

  const is${capitalizeFirstLetter(name)}Exists = await ${name}Service.exists({_id: id, deletedOn: { $exists: false } });

  ctx.assertError(is${capitalizeFirstLetter(name)}Exists, '${capitalizeFirstLetter(name)} not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { id } = ctx.request.params;
  const { name } = ctx.validatedData;

  const updated${capitalizeFirstLetter(name)} = await ${name}Service.updateOne({_id: id }, (prev) => ({...prev, name}));

  ctx.body = updated${capitalizeFirstLetter(name)};
}

export default (router: AppRouter) => {
  router.put('/:id', validateMiddleware(schema), validator, handler);
};
`;

export const actionRemoveContent = (name: string) => `import { AppKoaContext, AppRouter, Next } from 'types';

import { ${name}Service } from 'resources/${name}';

type ValidatedData = never;
type Request = {
  params: {
    id: string;
  };
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const { id } = ctx.request.params;
  
  const is${capitalizeFirstLetter(name)}Exists = await ${name}Service.exists({_id: id, deletedOn: { $exists: false } });
  
  ctx.assertError(is${capitalizeFirstLetter(name)}Exists, '${capitalizeFirstLetter(name)} not found');
  
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { id } = ctx.request.params;
  
  await ${name}Service.deleteSoft({ _id: id });

  ctx.status = 204;
}

export default (router: AppRouter) => {
  router.delete('/:id', validator, handler);
};
`;

export const schemaContent = (name: string) => `import { z } from 'zod';

import dbSchema from './db.schema';

export const ${name}Schema = dbSchema
  .extend({
    name: z.string(),
  })
  .strict();
`;

export const typeContent = (name: string) => `import { z } from 'zod';

import { ${name}Schema } from 'schemas';

export type ${capitalizeFirstLetter(name)} = z.infer<typeof ${name}Schema>;
`;

export const webApiIndexContent = (name: string) => `import * as ${name}Api from './${name}.api';

export { ${name}Api };
`;

export const webResourceContent = (name: string) => `import { useMutation, useQuery } from '@tanstack/react-query';

import { apiService } from 'services';

import { ${capitalizeFirstLetter(name)} } from 'types';

export const useCreate = <T>() =>
  useMutation<${capitalizeFirstLetter(name)}, unknown, T>({
    mutationFn: (data: T) => apiService.post('/${pluralize(name)}', data),
  });

export const useGet = (${name}Id: string, options = {}) =>
  useQuery<${capitalizeFirstLetter(name)}>({
    queryKey: ['${name}'],
    queryFn: () => apiService.get(\`/${pluralize(name)}/\${${name}Id}\`),
    ...options,
  });

export const useUpdate = <T>(${name}Id: string) =>
  useMutation<${capitalizeFirstLetter(name)}, unknown, T>({
    mutationFn: (data: T) => apiService.put(\`/${pluralize(name)}/\${${name}Id}\`, data),
  });

export const useDelete = () =>
  useMutation({
    mutationFn: (${name}Id: string) => apiService.delete(\`/${pluralize(name)}/\${${name}Id}\`),
  });
  `;
