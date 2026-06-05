# Web Component

A [TanStack Start](https://tanstack.com/start) SPA — TanStack Router (file-based routes),
TanStack Query, react-hook-form, [shadcn/ui](https://ui.shadcn.com/) and Tailwind v4.

The base web app ships the public surface: a landing page and type-safe **server functions**
for web-only backend logic. The oRPC client, the data hooks and the auth pages
(sign-in/up, forgot/reset, the authenticated app shell) are delivered by the **Auth plugin**,
which merges into your codebase.

For more detailed information, refer to the
[Web section in Ship documentation](https://ship.paralect.com/docs/web/overview).

## Getting Started

### Prerequisites

Ensure you have a `.env` file. If not, create one by copying the relevant `.env.*` file
(for example `.env.development`). Client env vars use the `VITE_` prefix and are read via
`import.meta.env`.

### Running the Application

You can start the application in two ways:

1. **Independent Start**: From the `apps/web` folder, run:
   ```sh
   pnpm run dev
   ```
2. **Root Start**: From the root of the project, run:
   ```sh
   pnpm start
   ```

The web app listens on `http://localhost:3002`.

## Routes

Routes are file-based under `src/routes/**` and mounted by [TanStack Router](https://tanstack.com/router):

```tsx
import { createFileRoute } from '@tanstack/react-router';

import Landing from '@/components/landings/dark';

export const Route = createFileRoute('/')({
  component: Landing,
});
```

Colocate private pieces in `-components/` folders the router ignores. Components avoid
`useEffect` (there's a skill enforcing it).

## Server functions (web-only data layer)

When you scaffold the **web-only** shape there's no `apps/api` — backend logic lives in
[TanStack Start server functions](https://ship.paralect.com/docs/web/server-functions).
SPA mode does **not** disable the server: server functions run on the Start/Nitro server,
where you can safely reach for secrets or a database.

Import `createServerFn` from `@tanstack/react-start` (the framework package) — **not** from
`@tanstack/react-router`:

```ts
import { createServerFn } from '@tanstack/react-start';

export const getGreeting = createServerFn({ method: 'GET' }).handler(async () => {
  return { message: 'Hello from the Start server' };
});
```

Call it from a route loader and read the result with `Route.useLoaderData()`:

```tsx
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

## Consuming the API (full-stack)

In the full-stack shape the **Auth plugin** adds the typed oRPC client and the
`useApiQuery` / `useApiMutation` / `useApiForm` hooks. The client is built from the API's
exported types — `import type { AppClient } from 'api'` over a `workspace:*` dependency — so
changing an endpoint's `.output()` updates the web types on the next build, with no codegen
and no shared types package.

## Features

### Development Tools

- **Fast HMR**: powered by [Vite](https://vite.dev/).
- **Code Quality**: linting with [ESLint](https://eslint.org/) and formatting with [Prettier](https://prettier.io/).
- **TypeScript Support**: full TypeScript support for a better development experience.

### Communication

- **WebSocket**: [Socket.IO](https://socket.io/) client wired up in `src/services/`.

### Styling

- **UI**: [shadcn/ui](https://ui.shadcn.com/) components on [Tailwind v4](https://tailwindcss.com/),
  with light/dark theming.
