---
sidebar_position: 6
---

# API Public Docs

## Overview
Keeping your public API up to date can be a cumbersome task that requires manually updating files. Our solution eliminates this hassle by allowing you to document your code itself, so you can focus on development without worrying about API updates.

## Usage
Just add `docsService.registerDocs` in your code. For example  
```typescript
export default (router: AppRouter) => {
  docsService.registerDocs({
    private: false,
    tags: ['account'],
    method: 'post',
    path: '/account/sign-up',
    summary: 'Sign up user',
    request: {},
    responses: {},
  });

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
const schema = z.object({
  firstName: z.string().min(1, 'Please enter First name').max(100),
  lastName: z.string().min(1, 'Please enter Last name').max(100),
  email: z.string().min(1, 'Please enter email').email('Email format is incorrect.'),
  password: z.string().regex(
    /^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
});

export default (router: AppRouter) => {
  docsService.registerDocs({
    private: false,
    tags: ['account'],
    method: 'post',
    path: '/account/sign-up',
    summary: 'Sign up',
    request: {
      body: { content: { 'application/json': { schema } } },
    },
    responses: {
      200: {
        description: 'Successfully sign up.',
      },
    },
  });

  router.post('/sign-up', validateMiddleware(schema), validator, handler);
};
```
Here we also added details inside `responses` property to let api user know what we might expect from there. For more details you can look at this [documentation](https://github.com/asteasolutions/zod-to-openapi)


For query, it will look like that:
```typescript
const schema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export default (router: AppRouter) => {
  docsService.registerDocs({
    private: false,
    tags: ['account'],
    method: 'get',
    path: '/account/verify-email',
    summary: 'Verify email',
    request: {
      query: schema,
    },
    responses: {
      302: {
        description: 'Redirect to web app',
      },
    },
  });

  router.get('/verify-email', validateMiddleware(schema), validator, handler);
};
```

Also, there is an option to make the endpoint secure. Just set the `private` property to `true`, and it will add JWT authorization to this endpoint.
## How it works
When you're calling `registerDocs` function, we add config in Registry. You can register docs in any part of application.
This config is written with this [standard](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#serverObject) in mind.
This registry contains all actions that gathered inside API. To retrieve these docs in open api format, you can call `docsService.getDocs` function.

For advanced usage cases, you can reference to this [documentation](https://github.com/asteasolutions/zod-to-openapi)
