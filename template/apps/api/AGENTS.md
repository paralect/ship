# API — Scoped Agent Instructions

> Applies when working inside `apps/api/`. Read root `AGENTS.md` first.

---

## Architecture at a Glance

Koa 3 + MongoDB (`@paralect/node-mongo`) + Zod 4. ESM (`"type": "module"`). TypeScript with `baseUrl: "src"`.

Domain logic lives in `src/resources/`. External integrations live in `src/services/`.

---

## Import Convention

`tsconfig.baseUrl` is `src`. Always use bare specifiers:

```typescript
import { userService } from 'resources/users'; // ✅
import createEndpoint from 'routes/createEndpoint'; // ✅
import config from 'config'; // ✅
import db from 'db'; // ✅

import { something } from 'src/resources/users'; // ❌ never
import { something } from '../../../resources/users'; // ❌ never
```

The ESLint plugin `no-relative-import-paths` enforces this (max depth 1, same-folder allowed).

---

## Middleware Chain (Global → Per-Route)

Global (applied to all requests in order):

1. `cors` → `helmet` → `qs` → `bodyParser` / `koaBody`
2. `attachCustomErrors` → `attachCustomProperties` → `routeErrorHandler`
3. `extractTokens` → `tryToAttachUser`

Per-route (auto-applied by route registration): 4. `auth` (unless `isPublic` present) → `validate` (if schema present) → custom middlewares → `handler`

The `auth` check (`routes/middlewares/auth.ts`) just verifies `ctx.state.user` exists; the actual token parsing happens in step 3.

---

## Available Middlewares

| Middleware                       | Import                           | Effect                                                        |
| -------------------------------- | -------------------------------- | ------------------------------------------------------------- |
| `isPublic`                       | `middlewares/isPublic`           | Sentinel — skips auth for this endpoint                       |
| `isAdmin`                        | `middlewares/isAdmin`            | Checks `x-admin-key` header against `config.ADMIN_KEY`        |
| `shouldExist(collection, opts?)` | `routes/middlewares/shouldExist` | Pre-fetches doc by ID param, 404 if missing                   |
| `rateLimitMiddleware(opts?)`     | `middlewares/rateLimit`          | Rate limit (default 10 req/60s/user, uses Redis if available) |

---

## Context Helpers

Available on `ctx` after global middleware:

- `ctx.state.user` — authenticated user (always present unless `isPublic`)
- `ctx.state.accessToken` — raw token string
- `ctx.validatedData` — Zod-validated merged input (body + query + params + files)
- `ctx.throwError(message, status?)` — throws structured error response (default status 400)
- `ctx.throwClientError({ field: 'message' })` — 400 with field errors
- `ctx.assertError(condition, message, status?)` — assert or throw (default status 400). **⚠️ This is a TypeScript assertion function — calling it inside `handler(ctx)` without an explicit type annotation on `ctx` causes TS2775. Prefer the `if + throwError + return` pattern instead:**

```typescript
// ✅ Preferred — no type annotation needed
const doc = await service.findOne({ _id: id, userId: ctx.state.user._id });
if (!doc) {
  ctx.throwError('Not found', 404);
  return;
}

// ❌ Avoid — requires explicit ctx type to compile
ctx.assertError(doc, 'Not found', 404);
```

---

## Config (Environment Variables)

Zod-validated in `src/config/index.ts`. When adding a new env var:

1. Add it to the Zod schema in `src/config/index.ts`
2. Add it to `.env` and `.env.example`

Required vars: `APP_ENV`, `API_URL`, `WEB_URL`, `MONGO_URI`, `MONGO_DB_NAME`.
Optional vars: `REDIS_URI`, `RESEND_API_KEY`, `ADMIN_KEY`, `MIXPANEL_API_KEY`, cloud storage, Google OAuth.

---

## Services (`src/services/`)

External integrations — not domain logic. Current services: `analytics`, `auth`, `cloud-storage`, `email`, `google`, `socket`, `stripe`.

To add a new service: create a folder in `src/services/`, export the service. Import where needed.

---

## Migrator & Scheduler

- Migrator: `src/migrator/migrations/<version>.ts` — each exports `Migration` with `migrate()`. Runs before dev via Turbo.
- Scheduler: `src/scheduler/handlers/*.handler.ts` — cron handlers listening on `cron:every-minute`/`cron:every-hour`. Register by importing in `src/scheduler.ts`.

---

## Verification

```bash
pnpm --filter api tsc --noEmit    # typecheck
pnpm --filter api eslint .        # lint
pnpm --filter api build           # full build
```

After adding endpoints, check startup logs for: `[routes] METHOD /resource/path`.

---

## Update Triggers

Update this file when:

- Global middleware chain changes (`src/routes/index.ts`, `src/app.ts`)
- New context helpers are added
- Config schema changes significantly
- New service directories are added
