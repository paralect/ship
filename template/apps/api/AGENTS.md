# API — Scoped Agent Instructions

> Applies when working inside `apps/api/`. Read root `AGENTS.md` first.

---

## Architecture

Hono + oRPC + MongoDB (`@paralect/node-mongo`) + Zod. ESM (`"type": "module"`). TypeScript with `baseUrl: "src"`.

- **Procedures** (`src/resources/*/procedures/`) — oRPC typed RPC endpoints. Return JSON data.
- **Routes** (`src/resources/*/routes/`) — Hono HTTP handlers for redirects (OAuth, email verification). These can't be procedures because they return `302 Redirect`, not JSON.
- **Services** (`src/services/`) — external integrations (auth, email, google, cloud-storage, socket, analytics).
- **Resources** (`src/resources/`) — domain logic (schemas, services, handlers, procedures).

---

## Import Convention

`tsconfig.baseUrl` is `src`. Use bare specifiers:

```typescript
import { userService } from 'resources/users'; // ✅
import config from 'config'; // ✅
import db from 'db'; // ✅
```

Exception: files inside `procedures/` use **relative imports** for anything in the type chain (required for declaration emission).

---

## oRPC Procedures

- `pub` (from `src/procedures.ts`) — public, no auth.
- `authed` — requires authenticated user. Provides `context.user` typed as `User`.

```typescript
import { authed } from '../../../procedures';
export default authed.input(schema).output(schema).handler(async ({ input, context }) => { ... });
```

---

## oRPC Context

Built in `app.ts` middleware, passed to all procedures:

```typescript
interface ORPCContext {
  user?: User;
  accessToken?: string;
  headers: Record<string, string>;
  getCookie / setCookie / deleteCookie;
  secure: boolean;
}
```

---

## Config

Zod-validated in `src/config/index.ts`. Add new env vars to both the schema and `.env`.

---

## Services (`src/services/`)

External integrations: `analytics`, `auth`, `cloud-storage`, `email`, `google`, `socket`.

---

## Migrator & Scheduler

- Migrator: `src/migrator/migrations/<version>.ts` — runs before dev via Turbo.
- Scheduler: `src/scheduler/handlers/*.handler.ts` — cron handlers. Register by importing in `src/scheduler.ts`.

---

## Verification

```bash
pnpm --filter api tsc --noEmit
pnpm --filter api build:types     # rebuild declarations for web
```
