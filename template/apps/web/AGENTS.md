# Web — Scoped Agent Instructions

> Applies when working inside `apps/web/`. Read root `AGENTS.md` first.

---

## Architecture

TanStack Start (SPA mode) on Vite + TanStack Router (file-based routes) + TanStack Query + shadcn/ui + Tailwind v4. ESM. TypeScript with the `@/` path alias (`@/` → `src`, via `vite-tsconfig-paths`).

- **Routes** (`src/routes/**`) — file-based; the directory tree _is_ the route table. `routeTree.gen.ts` regenerates automatically.
- **Components** (`src/components/`) — app components + shadcn/ui primitives in `src/components/ui/`.
- **Hooks** (`src/hooks/`) — shared React hooks.
- **Services** (`src/services/`) — client integrations (analytics, socket, ...).
- **Config** (`src/config/`) — Zod-validated client env (`VITE_`-prefixed, read from `import.meta.env`).

The base `apps/web` is **landing-only** — a static SPA with no data layer of its own. Where data comes from depends on the shape you scaffolded (see [Data access](#data-access)).

---

## SPA mode still has a server

`vite.config.ts` runs `tanstackStart` in `spa` mode. SPA mode turns off server-rendering your routes — it does **not** disable the Start (Nitro) server. That server is where server functions execute.

```ts
tanstackStart({
  spa: { enabled: true, prerender: { outputPath: 'index.html' } },
}),
```

The document shell, head and shared providers (TanStack Query, theming, tooltips, toaster) live in `src/routes/__root.tsx`.

---

## File-Based Routing

Routes live in `src/routes/`. The filename maps to the URL; `routeTree.gen.ts` regenerates on dev (never edit it).

| File                      | URL / role                                                 |
| ------------------------- | ---------------------------------------------------------- |
| `index.tsx`               | `/`                                                        |
| `about.tsx`               | `/about`                                                   |
| `users/$userId.tsx`       | `/users/:userId` (route param)                             |
| `_authenticated.tsx`      | pathless guarded layout                                    |
| `-components/filters.tsx` | private — the `-` prefix opts a folder/file out of routing |
| `$.tsx`                   | catch-all 404                                              |

A route file default-exports a `Route` built with `createFileRoute`:

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return <h1>About</h1>;
}
```

Colocate private, non-route pieces (a route's components/helpers) in a `-prefixed` folder so the router ignores them.

---

## No `useEffect`

This codebase **bans direct `useEffect`** (enforced by a lint rule). Before reaching for it, read the skill:

```
.agents/skills/no-use-effect/SKILL.md
```

Use derived state, event handlers, a data-fetching library (TanStack Query / the API hooks), or the `useMountEffect` escape hatch (`@/hooks`) for one-time external sync. Five replacement patterns are in the skill.

---

## UI — shadcn/ui + Tailwind v4

UI primitives are [shadcn/ui](https://ui.shadcn.com/) components copied into `src/components/ui/**` — your code, edit freely. Tailwind v4 is wired through `@tailwindcss/vite`; design tokens live in `src/globals.css`. Compose conditional classes with the `cn()` helper. Add a primitive with the shadcn CLI rather than hand-rolling one.

---

## Data Access

The base `apps/web` ships nothing to fetch. How you add data depends on the shape:

### Web-only — server functions

No `apps/api`. Backend logic runs on the Start server as **server functions**. Import `createServerFn` from **`@tanstack/react-start`** (the framework package) — **not** `@tanstack/react-router` (that one has `createFileRoute` / `Link` / `useNavigate` and does **not** export `createServerFn`).

```ts
import { createServerFn } from '@tanstack/react-start';

export const getStats = createServerFn({ method: 'GET' }).handler(async () => {
  return { count: 42 };
});
```

Consume it from a route `loader` and read it back with `Route.useLoaderData()`:

```tsx
import { createFileRoute } from '@tanstack/react-router';

import { getStats } from '@/server/stats';

export const Route = createFileRoute('/')({
  loader: () => getStats(),
  component: Home,
});

function Home() {
  const { count } = Route.useLoaderData();
  return <p>{count}</p>;
}
```

The handler body runs only on the server — reach for secrets or a database there. Pass and validate input with `.validator(zodSchema)`. Full pattern + the skill: `.agents/skills/server-functions/SKILL.md`.

### Full-stack — oRPC client (Auth plugin)

The typed oRPC client, the `useApiQuery` / `useApiMutation` / `useApiForm` hooks, and the sign-in/up + authenticated app-shell routes are **not in the base app** — they arrive with the **Auth plugin**. Once installed, the client mirrors the API contract one-to-one with no codegen (types flow via `import type { AppClient } from 'api'`):

```tsx
import { apiClient } from '@/services/api-client.service';
import { useApiQuery, useApiMutation, queryKey, useQueryClient } from '@/hooks';

function Notes() {
  const queryClient = useQueryClient();
  const { data: notes = [] } = useApiQuery(apiClient.notes.list);

  const create = useApiMutation(apiClient.notes.create, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKey(apiClient.notes.list) }),
  });

  return <button onClick={() => create.mutate({ text: 'hi' })}>Add</button>;
}
```

---

## Config

Zod-validated in `src/config/`. Client env vars use the `VITE_` prefix and are read from `import.meta.env` (e.g. `VITE_API_URL`). Add a new var to the Zod schema, the `processEnv` map, `env.d.ts`, and the `.env.*` files together.

---

## Verification

```bash
pnpm --filter web tsc --noEmit        # typecheck
pnpm --filter web eslint              # lint (catches direct useEffect)
pnpm --filter web dev                 # http://localhost:3002
```
