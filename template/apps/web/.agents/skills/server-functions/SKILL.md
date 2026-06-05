---
name: server-functions
description: >-
  Write and consume TanStack Start server functions — the web-only data layer.
  ACTIVATE when adding backend logic to a web-only Ship app (no apps/api),
  fetching data in a route loader, or when an agent reaches for createServerFn.
  Enforces importing createServerFn from @tanstack/react-start (NOT
  @tanstack/react-router), the createServerFn({ method }).handler() shape with
  optional .inputValidator(zodSchema), and consuming via a route loader +
  Route.useLoaderData(). Covers when to use server functions vs the oRPC client.
---

# Server functions (web-only data layer)

In the **web-only** Ship shape there is no `apps/api` and no oRPC client. Backend logic lives in **server functions**: typed async functions you write once and call from the client, while the body only ever runs on the server.

`createServerFn(...).handler(...)`, then call it. No routes to register, no client to generate.

## Quick Reference

- Import `createServerFn` from **`@tanstack/react-start`** — the framework package, NOT `@tanstack/react-router`.
- Shape: `createServerFn({ method: 'GET' | 'POST' }).handler(async (ctx) => ...)`.
- Validate inputs with `.inputValidator(zodSchema)` before `.handler(...)`; read the parsed value as `ctx.data`.
- Consume from a route `loader: () => fn()`, then read it with `Route.useLoaderData()`.
- SPA mode does **not** disable the server — handlers run on the TanStack Start (Nitro) server.
- Shipped example: `apps/web/src/server/greeting.ts` (`getGreeting` → `{ message }`).

| Need                                | Reach for                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------- |
| Read backend data (web-only)        | `createServerFn({ method: 'GET' }).handler(...)`                          |
| Write backend data (web-only)       | `createServerFn({ method: 'POST' }).inputValidator(...).handler(...)`     |
| Validate/parse the input            | `.inputValidator(zodSchema)` → `ctx.data`                                 |
| Run it before a route renders       | route `loader: () => fn()` + `Route.useLoaderData()`                      |
| Full-stack project (has `apps/api`) | the oRPC client + `useApiQuery` / `useApiMutation` (NOT server functions) |

## When to Use This Skill

- Adding backend logic to a web-only Ship app (no `apps/api`).
- Fetching data for a route in a `loader`.
- An agent imports `createServerFn` — verify it comes from `@tanstack/react-start`.
- Deciding between a server function and the oRPC client.

## The footgun: import from `@tanstack/react-start`

`createServerFn` comes from **`@tanstack/react-start`**. `@tanstack/react-router` is the package you import `createFileRoute`, `Link` and `useNavigate` from — it does **not** export `createServerFn`. Reach for the router package out of habit and you get an `undefined` import that fails at runtime.

```ts
// ✅ server functions — the framework package
import { createServerFn } from '@tanstack/react-start';

// ✅ routes, links, navigation — a different package
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
```

## SPA mode still has a server

Ship runs `apps/web` in SPA mode — see `vite.config.ts`:

```ts vite.config.ts
tanstackStart({
  spa: {
    enabled: true,
    prerender: { outputPath: 'index.html' },
  },
}),
```

SPA mode only turns off server-rendering your routes — they ship as a static SPA. The Start (Nitro) server is still there, and it is exactly where your server function handlers execute. **Web-only means no separate API app, not no server.** That is why you can reach for secrets, a database, or any server-only dependency inside `.handler(...)` — none of it ships to the browser.

## Workflow

### 1. Write the server function

Put it under `apps/web/src/server/`. The shipped example is the pattern to copy:

```ts apps/web/src/server/greeting.ts
import { createServerFn } from '@tanstack/react-start';

export const getGreeting = createServerFn({ method: 'GET' }).handler(async () => {
  return { message: 'Hello from the Start server' };
});
```

Three things define it:

- **`createServerFn({ method })`** — `'GET'` for reads, `'POST'` for writes. The method is how the client transports the call to the server.
- **`.handler(async (ctx) => ...)`** — the body. It runs **only on the server**. Server-only deps go here.
- The **return value** is sent back to the caller, fully typed end to end. The client sees the handler's return type with no codegen.

### 2. Validate inputs (when the function takes data)

Pass `.inputValidator()` a Zod schema. It parses the input on the server before the handler runs, and the handler receives a validated, typed `ctx.data`:

```ts apps/web/src/server/notes.ts
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

export const createNote = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ text: z.string().min(1) }))
  .handler(async ({ data }) => {
    // data.text is validated and typed
    return { id: crypto.randomUUID(), text: data.text };
  });
```

Call it with the argument the validator expects:

```ts
const note = await createNote({ data: { text: 'first note' } });
```

For reads that take parameters, do the same with `method: 'GET'` and read `data` in the handler.

### 3. Consume it from a route loader

A server function is just an async function, so you can call it anywhere. The idiomatic place is a route **`loader`**: TanStack Router runs it before the route renders, and the component reads the result with `Route.useLoaderData()`.

```tsx apps/web/src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';

import { getGreeting } from '@/server/greeting';

export const Route = createFileRoute('/')({
  loader: () => getGreeting(),
  component: Home,
});

function Home() {
  const { message } = Route.useLoaderData();

  return <h1>{message}</h1>;
}
```

The loader calls the server function; from the browser that is a request to the Start server, which runs the handler and returns the value. `Route.useLoaderData()` reads it back, typed.

Do **not** fetch in a `useEffect` — that is exactly the pattern the loader replaces (see the `no-use-effect` skill). The loader is the data-fetching boundary.

### 4. Verify

```bash
pnpm --filter web tsc --noEmit
```

## Server functions vs the oRPC client

The choice is determined by which shape you scaffolded — not a per-feature decision.

| You scaffolded                  | Data layer        | Import from                                   |
| ------------------------------- | ----------------- | --------------------------------------------- |
| **TanStack Start web-only**     | Server functions  | `@tanstack/react-start`                       |
| **PostgreSQL + TanStack Start** | oRPC typed client | `@/services/api-client.service` (Auth plugin) |

- **Web-only** → there is no `apps/api`. Backend logic runs on the Start server as `createServerFn` handlers, called from loaders and components. Reach for server-only deps directly in the handler.
- **Full-stack** → there is an `apps/api`. The web app talks to it through a fully typed oRPC client and the `useApiQuery` / `useApiMutation` / `useApiForm` hooks the **Auth** plugin adds. In that shape, do not introduce server functions — use the client.

Both shapes start from the **same** `apps/web` base: a landing page plus the `getGreeting` example. The difference is where data comes from. If you later add an API, you move data fetching from server functions to the oRPC client; the routing, components and TanStack Query setup are unchanged.
