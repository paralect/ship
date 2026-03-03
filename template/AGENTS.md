# AGENTS.md — AI Agent Instructions for Ship Monorepo

> **Self-maintenance rule**: Any code change that adds, removes, or renames a resource, endpoint, page, component, schema, constant, service, or alters the project structure **MUST** include a parallel update to this `AGENTS.md` file if the change contradicts or is not covered by the instructions below. Never let this document become stale.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Monorepo Structure](#3-monorepo-structure)
4. [API (Koa + MongoDB)](#4-api-koa--mongodb)
5. [Web (Next.js + shadcn/ui + Tailwind)](#5-web-nextjs--shadcnui--tailwind)
6. [Shared Package & API Client Generation](#6-shared-package--api-client-generation)
7. [Full-Stack Feature Checklist](#7-full-stack-feature-checklist)
8. [Self-Maintenance Protocol](#8-self-maintenance-protocol)

---

## 1. Project Overview

This is a **pnpm monorepo** (Turborepo) with two applications and several shared packages:

| Path | Purpose |
|------|---------|
| `apps/api` | Koa.js REST API with MongoDB |
| `apps/web` | Next.js (Pages Router) frontend |
| `packages/shared` | Auto-generated typed API client, Zod schemas, shared types |
| `packages/app-constants` | Shared constants (DB document names, cookies, token TTLs) |
| `packages/mailer` | React Email templates + send utility |
| `packages/eslint-config` | Shared ESLint configs (`node.js`, `next.js`) |
| `packages/prettier-config` | Shared Prettier config |
| `packages/tsconfig` | Shared TypeScript configs (`nodejs.json`, `nextjs.json`) |

**Package manager**: pnpm (>=9.5.0). **Never** use npm or yarn.
**Node version**: >=22.13.0 (see `.nvmrc`).

---

## 2. Tech Stack

### API
- **Runtime**: Node.js + TypeScript (ESM, `"type": "module"`)
- **Framework**: Koa.js 3 (`@koa/router`, `koa-body`, `koa-helmet`, `koa-mount`)
- **Database**: MongoDB via `@paralect/node-mongo` (wraps native driver with schema validation, event bus, soft deletes)
- **Validation**: Zod 4
- **Auth**: Cookie-based access tokens (argon2 password hashing, oslo crypto)
- **Real-time**: Socket.IO (with optional Redis adapter)
- **Email**: Resend + React Email (via `packages/mailer`)
- **AI**: Vercel AI SDK + Google Generative AI
- **Caching**: Redis (ioredis), optional
- **Task scheduling**: `node-schedule` cron

### Web
- **Framework**: Next.js 15 (Pages Router, `pageExtensions: ['page.tsx', 'api.ts']`)
- **UI**: shadcn/ui (New York style, `rsc: false`), Radix UI primitives, Tailwind CSS
- **State/Data**: TanStack React Query v5, React Hook Form v7 + `@hookform/resolvers` (Zod)
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)
- **Real-time**: Socket.IO client
- **Theming**: `next-themes` (system/light/dark)

### Shared
- Axios-based `ApiClient` class
- Auto-generated typed endpoints from API resource analysis
- Zod schemas synced from API → shared at generation time

---

## 3. Monorepo Structure

```
template/
├── apps/
│   ├── api/                    # Koa API
│   │   └── src/
│   │       ├── app.ts          # Koa setup + server start
│   │       ├── db.ts           # MongoDB connection + createService helper
│   │       ├── config/         # Zod-validated env config
│   │       ├── resources/      # ★ Domain resources (each = DB collection + endpoints)
│   │       │   ├── base.schema.ts   # dbSchema, paginationSchema, emailSchema, passwordSchema
│   │       │   ├── users/
│   │       │   ├── account/
│   │       │   ├── chats/
│   │       │   └── ...
│   │       ├── routes/         # Endpoint registration system
│   │       │   ├── createEndpoint.ts   # Typed endpoint factory
│   │       │   ├── createMiddleware.ts # Typed middleware factory
│   │       │   ├── routes.ts           # Auto-discovery + registration
│   │       │   └── middlewares/        # Route middlewares (auth, shouldExist, etc.)
│   │       ├── middlewares/    # Global middlewares (isPublic, isAdmin, validate, rateLimit)
│   │       ├── services/       # External integrations (email, analytics, stripe, AI, etc.)
│   │       ├── migrator/       # Database migration system
│   │       └── scheduler/      # Cron jobs
│   └── web/                    # Next.js frontend
│       └── src/
│           ├── pages/          # File-based routing (*.page.tsx)
│           ├── components/     # Shared components + shadcn/ui
│           │   ├── ui/         # shadcn/ui primitives (button, input, dialog, etc.)
│           │   ├── Table/      # Reusable data table component
│           │   └── index.ts    # Barrel exports
│           ├── hooks/          # Custom hooks (useApiQuery, useApiMutation, useApiForm, useApiStreamMutation)
│           ├── services/       # API client init, socket, analytics
│           ├── config/         # Zod-validated client env config
│           ├── contexts/       # React contexts
│           ├── lib/            # Utility functions (cn() from shadcn)
│           └── utils/          # Error handling, config validation
├── packages/
│   ├── shared/                 # ★ Auto-generated API client + synced schemas
│   │   ├── scripts/generate.ts # Generation script (reads API resources → outputs typed client)
│   │   └── src/
│   │       ├── client.ts       # ApiClient class (Axios wrapper)
│   │       ├── schemas/        # Synced copies of API *.schema.ts files
│   │       ├── generated/      # ★ Auto-generated: schemas, types, endpoint functions
│   │       ├── types.ts        # Shared utility types (ListResult, SortParams, etc.)
│   │       └── constants.ts    # Shared constants (file sizes, password rules)
│   ├── app-constants/          # DB document names, cookie names, token TTLs
│   └── mailer/                 # React Email templates
├── docker-compose.yml          # MongoDB + Redis for local dev
├── turbo.json                  # Turborepo pipeline config
└── pnpm-workspace.yaml         # Workspace definition + version catalog
```

---

## 4. API (Koa + MongoDB)

### 4.1. Resource Architecture

Every domain entity follows this strict structure inside `apps/api/src/resources/<resource-name>/`:

```
resources/<resource-name>/
├── <name>.schema.ts     # Zod schema defining the DB document shape (extends dbSchema)
├── <name>.service.ts    # MongoDB service (created via db.createService)
├── <name>.handler.ts    # Event bus handlers (optional — for side effects on create/update/delete)
├── index.ts             # Barrel: imports handler (side-effect), exports service
└── endpoints/           # One file per API endpoint
    ├── list.ts
    ├── create.ts
    ├── update.ts
    ├── remove.ts
    └── ...
```

### 4.2. Creating a New Resource — Step by Step

#### Step 1: Register the collection name in `packages/app-constants/src/api.constants.ts`

```typescript
export const DATABASE_DOCUMENTS = {
  USERS: 'users',
  TOKENS: 'tokens',
  CHATS: 'chats',
  MESSAGES: 'messages',
  PROJECTS: 'projects',   // ← add new entry
};
```

#### Step 2: Create the schema — `resources/projects/project.schema.ts`

Always extend from `dbSchema` (provides `_id`, `createdOn`, `updatedOn`, `deletedOn`):

```typescript
import { z } from 'zod';

import { dbSchema } from '../base.schema';

export const projectSchema = dbSchema.extend({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
  status: z.enum(['active', 'archived']).default('active'),
});

export type Project = z.infer<typeof projectSchema>;
```

#### Step 3: Create the service — `resources/projects/project.service.ts`

```typescript
import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';

import type { Project } from './project.schema';
import { projectSchema } from './project.schema';

const service = db.createService<Project>(DATABASE_DOCUMENTS.PROJECTS, {
  schemaValidator: (obj) => projectSchema.parseAsync(obj),
});

// Create indexes as needed
service.createIndex({ userId: 1 });

export default service;
```

**Key `db.createService` facts**:
- Uses `@paralect/node-mongo` — provides `find`, `findOne`, `insertOne`, `updateOne`, `deleteSoft`, `exists`, `distinct`, `atomic`, etc.
- `schemaValidator` runs Zod validation on every write.
- `deleteSoft` sets `deletedOn` instead of removing. All queries auto-filter `deletedOn: null` by default.
- `find(filter, { page, perPage }, { sort })` returns `{ results, pagesCount, count }`.
- Event bus: `eventBus.on('collection.created' | 'collection.updated' | 'collection.deleted', handler)`.

#### Step 4: Create the barrel — `resources/projects/index.ts`

```typescript
import projectService from './project.service';

export { projectService };
```

If you add a handler file, import it for side effects:

```typescript
import './project.handler';

import projectService from './project.service';

export { projectService };
```

#### Step 5: Create endpoints — `resources/projects/endpoints/*.ts`

Every endpoint file **default-exports** the result of `createEndpoint()`:

```typescript
import { z } from 'zod';

import { projectService } from 'resources/projects';

import createEndpoint from 'routes/createEndpoint';

const schema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

export default createEndpoint({
  method: 'post',      // 'get' | 'post' | 'put' | 'patch' | 'delete'
  path: '/',           // relative to /<resource-name>
  schema,              // optional — Zod schema for validation
  middlewares: [],     // optional — [isPublic], [isAdmin], [shouldExist('projects')], etc.

  async handler(ctx) {
    const { name, description } = ctx.validatedData;  // typed by schema
    const userId = ctx.state.user._id;                 // always available (auth is default)

    const project = await projectService.insertOne({
      name,
      description,
      userId,
    });

    return project;  // returned value becomes ctx.body automatically
  },
});
```

### 4.3. Endpoint Registration (Auto-Discovery)

Endpoints are **auto-discovered** at startup. The system:
1. Scans `resources/` for directories that contain an `endpoints/` subfolder.
2. Dynamically imports each `.ts` file in `endpoints/`.
3. Registers each as `/<resource-name><endpoint-path>` with the specified HTTP method.
4. Automatically prepends `auth` middleware unless `isPublic` middleware is present.
5. Automatically prepends `validate` middleware if a schema is provided.

**No manual route registration is needed.** Just create the file in `endpoints/` and it works.

### 4.4. Endpoint Conventions

| Convention | Rule |
|-----------|------|
| **Auth** | All endpoints require auth by default. Add `isPublic` to `middlewares` array for public routes. |
| **Validation** | Define a `schema` (Zod) — the `validate` middleware merges `body + files + query + params` and validates. Validated data is on `ctx.validatedData`. |
| **Path params** | Use Koa-style `:param` in path (e.g., `path: '/:id'`). Access via `ctx.request.params.id`. |
| **Response** | Return a value from `handler` — it becomes `ctx.body`. For no-content, set `ctx.status = 204` and return nothing. |
| **HTTP methods** | `get` = read, `post` = create, `put` = full update, `patch` = partial update, `delete` = remove. |
| **File naming** | kebab-case matching the action: `list.ts`, `create.ts`, `update.ts`, `remove.ts`, `get-messages.ts`. |
| **Middlewares** | `isPublic` (skip auth), `isAdmin` (require admin key header), `shouldExist('collection')` (pre-fetch entity), `rateLimitMiddleware()`. |

#### `shouldExist` middleware with custom criteria

To scope entity lookups (e.g., ensure the entity belongs to the current user), pass a `criteria` callback:

```typescript
import shouldExist from 'routes/middlewares/shouldExist';

middlewares: [
  shouldExist('todos', {
    criteria: (ctx) => ({ _id: ctx.params.todoId, userId: ctx.state.user._id }),
  }),
],
```

The middleware pre-fetches the entity and returns 404 if not found.

### 4.5. Schema Conventions

- **`base.schema.ts`** provides: `dbSchema`, `paginationSchema`, `emailSchema`, `passwordSchema`, `listResultSchema`.
- Entity schemas extend `dbSchema`.
- Endpoint input schemas are **separate** from entity schemas — pick/extend as needed.
- Schemas defined in endpoint files can be inline (local `const schema = ...`) or imported.

### 4.6. Handler (Event Bus)

Optional file for side effects when DB documents change:

```typescript
import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { DATABASE_DOCUMENTS } from 'app-constants';

import type { Project } from './project.schema';

const { PROJECTS } = DATABASE_DOCUMENTS;

eventBus.on(`${PROJECTS}.created`, (data: InMemoryEvent<Project>) => {
  // e.g., send notification, update analytics, emit socket event
});
```

### 4.7. Services (`apps/api/src/services/`)

External integrations live here (not domain logic). Examples: `email/`, `analytics/`, `stripe/`, `ai/`, `cloud-storage/`, `socket/`, `google/`.

### 4.8. Migrator

- Migration files: `apps/api/src/migrator/migrations/<version>.ts`
- Each exports a `Migration` instance with a `migrate()` async method.
- Runs on startup (via `turbo` pipeline: `api#migrate-dev` → `api#schedule-dev` → `dev`).

### 4.9. Scheduler (Cron)

- Cron emitter: `apps/api/src/scheduler/cron/index.ts` — emits `cron:every-minute`, `cron:every-hour`.
- Handlers: `apps/api/src/scheduler/handlers/*.handler.ts` — listen to cron events.
- Register new handlers by importing them in `apps/api/src/scheduler.ts`.

### 4.10. Config

Environment variables are **Zod-validated** in `apps/api/src/config/index.ts`. When adding a new env var, add it to the Zod schema there and to `.env` / `.env.example`.

---

## 5. Web (Next.js + shadcn/ui + Tailwind)

### 5.1. Page Structure

Pages use the **Next.js Pages Router** with a custom page extension: `*.page.tsx`.

```
src/pages/
├── index.page.tsx              # Root (renders Home)
├── _app.page.tsx               # App wrapper (QueryClient, ThemeProvider, Toaster)
├── _document.page.tsx          # Document
├── home/
│   └── index.tsx               # Home page component (imported by index.page.tsx)
├── sign-in/
│   ├── index.page.tsx          # Sign-in page
│   └── components/             # Page-specific components
├── admin/
│   ├── index.page.tsx          # Admin page
│   ├── components/             # Page-specific components
│   └── constants.ts            # Page-specific constants
├── chat/
│   ├── index.page.tsx          # Chat list page
│   ├── [chatId].page.tsx       # Dynamic chat page
│   ├── components/             # Chat components
│   └── hooks/                  # Chat-specific hooks
└── profile/
    ├── index.page.tsx
    └── components/
```

### 5.2. Creating a New Page

#### Step 1: Create the page file

```
src/pages/projects/index.page.tsx
```

```tsx
import Head from 'next/head';
import { useApiQuery } from 'hooks';

import { LayoutType, Page, ScopeType } from 'components';

import { apiClient } from 'services/api-client.service';

const Projects = () => {
  const { data: projects, isLoading } = useApiQuery(apiClient.projects.list);

  return (
    <Page scope={ScopeType.PRIVATE} layout={LayoutType.MAIN}>
      <Head>
        <title>Projects</title>
      </Head>

      <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
        <h2 className="text-xl font-semibold sm:text-2xl">Projects</h2>
        {/* Page content */}
      </div>
    </Page>
  );
};

export default Projects;
```

#### Key patterns:
- **Every page** wraps content in `<Page scope={...} layout={...}>`.
- `ScopeType.PRIVATE` — requires auth (redirects to `/sign-in` if not logged in).
- `ScopeType.PUBLIC` — only for non-authenticated users (redirects to `/` if logged in).
- `LayoutType.MAIN` — app shell with sidebar navigation.
- `LayoutType.UNAUTHORIZED` — centered layout for auth pages.

### 5.3. Consuming the API

The web app uses the **auto-generated typed API client** from `packages/shared`:

```typescript
// services/api-client.service.ts
import { ApiClient, createApiEndpoints } from 'shared';
const client = new ApiClient({ baseURL: config.API_URL, withCredentials: true });
export const apiClient = createApiEndpoints(client);
```

#### Queries (GET requests):

```tsx
import { useApiQuery } from 'hooks';
import { apiClient } from 'services/api-client.service';

// No params
const { data, isLoading } = useApiQuery(apiClient.account.get);

// With params
const { data: users } = useApiQuery(apiClient.users.list, { page: 1, perPage: 10 });

// With path params
const { data: messages } = useApiQuery(apiClient.chats.getMessages, {
  pathParams: { chatId: '123' },
});
```

#### Mutations (POST/PUT/DELETE):

```tsx
import { useApiMutation } from 'hooks';
import { apiClient } from 'services/api-client.service';

const { mutate: createProject, isPending } = useApiMutation(apiClient.projects.create);

createProject({ name: 'My Project' }, {
  onSuccess: (data) => { /* handle success */ },
  onError: (e) => handleApiError(e, setError),
});
```

#### Mutations with path params:

`useApiMutation` accepts `pathParams` at the **hook level** (fixed for all calls), not per `mutate()` call. If you need **dynamic path params** (e.g., different IDs per call in a list), use `endpoint.call()` directly instead:

```tsx
// ✅ Direct .call() for dynamic path params
const handleDelete = async (todoId: string) => {
  await apiClient.todos.remove.call({}, { pathParams: { todoId } });
  queryClient.invalidateQueries({ queryKey: [apiClient.todos.list.path] });
};

// ✅ Hook-level pathParams when the ID is fixed (e.g., single entity page)
const { mutate: updateChat } = useApiMutation(apiClient.chats.update, {
  pathParams: { chatId },
});
```

#### Forms with validation:

```tsx
import { useApiForm, useApiMutation } from 'hooks';
import { apiClient } from 'services/api-client.service';

// useApiForm auto-configures react-hook-form with the endpoint's Zod schema
const methods = useApiForm(apiClient.projects.create);
const { register, handleSubmit, setError, formState: { errors } } = methods;

const { mutate: create } = useApiMutation(apiClient.projects.create);

const onSubmit = handleSubmit((data) =>
  create(data, { onError: (e) => handleApiError(e, setError) }),
);
```

#### Streaming mutations (SSE):

```tsx
import { useApiStreamMutation } from 'hooks';

const { mutate, isLoading } = useApiStreamMutation(apiClient.chats.sendMessage);

mutate({ content: 'Hello' }, {
  pathParams: { chatId },
  onToken: (token) => { /* append streamed text */ },
  onDone: (data) => { /* handle completion */ },
  onError: (error) => { /* handle error */ },
});
```

### 5.4. Component Conventions

#### shadcn/ui components (`src/components/ui/`)

- Installed via `npx shadcn@latest add <component>` (style: `new-york`, no RSC)
- Import with `@/` alias: `import { Button } from '@/components/ui/button'`
- **Do not** modify shadcn component files unless absolutely necessary — prefer wrapping

#### Page-specific components

- Live in `pages/<page-name>/components/`
- Are **not** exported globally — only used by their parent page

#### Shared components (`src/components/`)

- Exported via barrel `src/components/index.ts`
- Import as: `import { Table, Page, ScopeType, LayoutType } from 'components'`

### 5.5. Styling

- **Tailwind CSS** for all styling. No CSS modules, no styled-components.
- Use `cn()` from `@/lib/utils` to merge class names: `cn('base-class', conditional && 'active')`
- Responsive: mobile-first (`sm:`, `md:`, `lg:` breakpoints)
- Dark mode: CSS variables via `next-themes`, use semantic colors (`text-foreground`, `bg-background`, `text-muted-foreground`, etc.)

### 5.6. Config

Client-side env vars must be prefixed with `NEXT_PUBLIC_` and validated in `src/config/index.ts` via Zod.

### 5.7. Error Handling

Use `handleApiError(e, setError)` from `utils` — maps server validation errors to react-hook-form field errors, shows global errors via Sonner toast.

### 5.8. Query Invalidation

To refetch data after a mutation, invalidate the relevant query key using the endpoint's `.path`:

```tsx
import queryClient from 'query-client';
import { apiClient } from 'services/api-client.service';

// Invalidate a list query after create/update/delete
queryClient.invalidateQueries({ queryKey: [apiClient.todos.list.path] });

// Set query data directly (e.g., after updating the current user)
queryClient.setQueryData([apiClient.account.get.path], updatedAccount);
```

The `queryClient` singleton is imported from `query-client` (a top-level module in the web app). Query keys are arrays where the first element is `endpoint.path`.

### 5.9. Real-time (Sockets)

- Socket setup: `src/services/socket.service.ts`
- Handlers: `src/services/socket-handlers.ts` — listens for events like `user:updated` and updates React Query cache.
- Socket handlers are imported as side-effects in `PageConfig`.

---

## 6. Shared Package & API Client Generation

### 6.1. How It Works

The `packages/shared` package bridges API and Web with **zero manual type maintenance**:

```
API (apps/api/src/resources/)
        │
        ▼
  generate.ts script                    ← `pnpm --filter shared generate`
        │
        ├─→ packages/shared/src/schemas/    (copies *.schema.ts files from API)
        └─→ packages/shared/src/generated/  (generates typed API client)
                │
                ▼
        Web imports from 'shared'
```

The generation script (`packages/shared/scripts/generate.ts`):
1. **Syncs schemas**: Copies all `*.schema.ts` files from `apps/api/src/resources/` to `packages/shared/src/schemas/`.
2. **Scans endpoints**: Reads each `endpoints/*.ts` file, extracts method, path, schema, and path params.
3. **Infers return types**: Uses the TypeScript compiler API to infer handler return types.
4. **Generates `src/generated/index.ts`**: Produces typed endpoint descriptors, param types, response types, and `createApiEndpoints()` factory.

### 6.2. What Gets Generated

The generated file exports:

| Export | Description |
|--------|-------------|
| `schemas` | Object tree: `schemas.<resource>.<endpoint>` → Zod schema |
| `*Params` types | `z.infer` of each endpoint's schema (e.g., `UsersListParams`) |
| `*PathParams` types | Path parameter types (e.g., `{ chatId: string }`) |
| `*Response` types | Inferred handler return types (e.g., `UsersListResponse`) |
| `createApiEndpoints(client)` | Factory that creates typed endpoint methods |
| `ApiEndpoints` | Type of the full endpoints object |
| `InferParams<T>`, `InferPathParams<T>`, `InferResponse<T>` | Utility types |

### 6.3. When to Regenerate

Run `pnpm --filter shared generate` after:
- Adding/removing/modifying any endpoint in `apps/api/src/resources/*/endpoints/`
- Adding/modifying any `*.schema.ts` file in API resources
- Changing an endpoint's method, path, schema, or return type

**Watch mode** (for development): `pnpm --filter shared generate:watch` — auto-regenerates on changes to API resources.

### 6.4. Using Generated Types in Web

```typescript
// Import types directly from 'shared'
import {
  UsersListParams,
  UsersListResponse,
  AccountGetResponse,
  ChatsCreateParams,
} from 'shared';

// Import schemas for client-side validation
import { schemas } from 'shared';
const signUpSchema = schemas.account.signUp;  // Zod schema
```

### 6.5. Adding a New Resource End-to-End

When adding a new full-stack feature (e.g., "projects"):

1. **API**: Create `resources/projects/` with schema, service, index, and endpoints (see §4.2)
2. **Constants**: Add `PROJECTS: 'projects'` to `DATABASE_DOCUMENTS` in `packages/app-constants`
3. **Generate**: Run `pnpm --filter shared generate`
4. **Web**: Use `apiClient.projects.*` in pages/components with `useApiQuery`/`useApiMutation`
5. **Verify**: Generated types like `ProjectsCreateParams`, `ProjectsListResponse` are now available from `'shared'`

---

## 7. Full-Stack Feature Checklist

When creating a complete new feature, follow this order:

### API Side
- [ ] Add collection name to `packages/app-constants/src/api.constants.ts` (`DATABASE_DOCUMENTS`)
- [ ] Create `apps/api/src/resources/<name>/<name>.schema.ts` extending `dbSchema`
- [ ] Create `apps/api/src/resources/<name>/<name>.service.ts` using `db.createService`
- [ ] Create `apps/api/src/resources/<name>/index.ts` barrel (export service, import handler)
- [ ] Create endpoint files in `apps/api/src/resources/<name>/endpoints/`
- [ ] (Optional) Create `<name>.handler.ts` for event bus side effects
- [ ] (Optional) Add indexes in the service file

### Shared Package
- [ ] Run `pnpm --filter shared generate` to sync schemas and generate typed client
- [ ] Verify generated types in `packages/shared/src/generated/index.ts`

### Web Side
- [ ] Create page at `apps/web/src/pages/<name>/index.page.tsx`
- [ ] Use `useApiQuery` / `useApiMutation` with `apiClient.<resource>.<endpoint>`
- [ ] Import types from `'shared'` (e.g., `ProjectsListResponse`)
- [ ] Add page-specific components in `pages/<name>/components/`
- [ ] (Optional) Add navigation link in `MainLayout` sidebar

### Verification
- [ ] API starts without errors
- [ ] Endpoints appear in startup logs: `[routes] GET /projects`, etc.
- [ ] Web compiles and pages load correctly
- [ ] Types are correct — no `any` or type errors

---

## 8. Self-Maintenance Protocol

### When This File Must Be Updated

This `AGENTS.md` MUST be updated in the **same commit/PR** when any of the following changes occur:

1. **New resource added or removed** in `apps/api/src/resources/`
2. **Resource structure pattern changes** (e.g., new required file in resource folder)
3. **`createEndpoint` API changes** (new options, changed signatures)
4. **Route registration logic changes** in `apps/api/src/routes/`
5. **New shared package** added to `packages/`
6. **`packages/shared/scripts/generate.ts` behavior changes**
7. **New hook added** to `apps/web/src/hooks/` (e.g., new `useApi*` variant)
8. **Page structure/layout pattern changes** (new `ScopeType`, `LayoutType`, etc.)
9. **Middleware added or changed** in `apps/api/src/middlewares/`
10. **Tech stack additions** (new major dependency affecting architecture)
11. **Build/dev workflow changes** in `turbo.json` or root `package.json`
12. **New component pattern** added to `apps/web/src/components/`
13. **Environment variable schema changes** in API or Web config

### How to Update

- Locate the relevant section in this file.
- Update the instructions, examples, or tables to reflect the new reality.
- If a pattern is deprecated, remove it and add the replacement.
- Keep examples minimal but complete — they serve as templates for AI agents.

### Rule for AI Agents

**Before completing any task**, verify:
> "Does my change introduce a pattern not documented in `AGENTS.md`, or contradict an existing instruction?"

If yes → update `AGENTS.md` as part of the same change.
