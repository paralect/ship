---
sidebar_position: 2
---

# Usage
Just add `docsService.registerDocs` in your code. For example
```typescript
// resources/account/actions/sign-up/doc.ts
const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'post',
  path: `/${resourceName}/sign-up`,
  summary: 'Sign up',
  request: {},
  responses: {},
};
export default config;

// resources/account/actions/sign-up/index.ts
import docConfig from './doc';

export default (router: AppRouter) => {
  docsService.registerDocs(docConfig);

  router.post('/sign-up', validateMiddleware(schema), validator, handler);
};
```
Here we just added `/account/sign-up` path to open api specification. Later on we will learn how to customise it.
To look at result you can launch application and make call to api endpoint with `/docs/json` path. E.g. `http://localhost:3002/docs/json` if you're using local server.
It will return you json specification in [Open API standard](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#serverObject).
You can use tools like [Swagger Editor](https://editor-next.swagger.io/) to see it in pretty editor.


In order to add body, params or query, you can add zod schema inside `request` property.
E.g. for body it will look like that:
```typescript
// schemas/empty.schema.ts
export const EmptySchema = docsService.registerSchema('EmptyObject', z.object({}));

// resources/account/actions/sign-up/schema.ts
export const schema = z.object({
  firstName: z.string().min(1, 'Please enter First name').max(100),
  lastName: z.string().min(1, 'Please enter Last name').max(100),
  email: z.string().min(1, 'Please enter email').email('Email format is incorrect.'),
  password: z.string().regex(
    PASSWORD_REGEXP,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
});

// resources/account/actions/sign-up/doc.ts
import { resourceName } from 'resources/account/constants';
import { schema } from './schema';
import { EmptySchema } from 'schemas/empty.schema';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'post',
  path: `/${resourceName}/sign-up`,
  summary: 'Sign up',
  request: {
    body: { content: { 'application/json': { schema } } },
  },
  responses: {
    200: {
      description: 'Empty data.',
      content: {
        'application/json': {
          schema: EmptySchema,
        },
      },
    },
  },
};

export default config;
```
Here we also added details inside `responses` property to let api user know what we might expect from there. For that we have used `docsService.registerSchema` function. For more details you can look at this [documentation](https://github.com/asteasolutions/zod-to-openapi)


For query, it will look like that:
```typescript
// resources/account/actions/verify-email/schema.ts
export const schema = z.object({
  token: z.string().min(1, 'Token is required'),
});

// resources/account/actions/verify-email/doc.ts
import { resourceName } from 'resources/account/constants';
import { schema } from './schema';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'get',
  path: `/${resourceName}/verify-email`,
  summary: 'Verify email',
  request: {
    query: schema,
  },
  responses: {
    302: {
      description: 'Redirect to web app',
    },
  },
};

export default config;
```

Also, there is an option to make the endpoint secure. Just set the `private` property to `true`, and it will add JWT authorization to this endpoint.
If your auth method is not JWT, then there is built-in `cookie-auth` strategy. To update set it, you can set `authType` in config.
```typescript
// resources/account/actions/verify-email/doc.ts
import { resourceName } from 'resources/account/constants';
import { schema } from './schema';

const config: RouteExtendedConfig = {
  private: false,
  authType: 'cookieAuth',
  tags: [resourceName],
  method: 'get',
  path: `/${resourceName}/verify-email`,
  summary: 'Verify email',
  request: {
    query: schema,
  },
  responses: {
    302: {
      description: 'Redirect to web app',
    },
  },
};

export default config;
```
If you need other strategies, please look at `docs.service.ts` file. There will be option to extend methods like that:
```typescript
registry.registerComponent('securitySchemes', 'customAuth', {
  type: 'apiKey',
  in: 'cookie',
  name: 'JSESSIONID',
});
```
