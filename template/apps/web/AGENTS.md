# Web — Scoped Agent Instructions

> Applies when working inside `apps/web/`. Read root `AGENTS.md` first.

---

## Architecture at a Glance

Next.js 15, Pages Router, React 19, Tailwind CSS 4, shadcn/ui (New York, no RSC), TanStack React Query v5, React Hook Form v7, Zod 4.

---

## Routing: Pages Router with Custom Extension

**Only files matching `*.page.tsx` or `*.api.ts` are routes** (set in `next.config.mjs` → `pageExtensions`).

This means:

- `pages/projects/index.page.tsx` ✅ → `/projects`
- `pages/projects/[id].page.tsx` ✅ → `/projects/:id`
- `pages/projects/index.tsx` ❌ → not a route (invisible to Next.js)
- `pages/projects/components/Card.tsx` ✅ → correctly ignored (no `.page.tsx`)

Helper components, hooks, and constants in page folders are safe — they won't become routes.

---

## Page Template

```tsx
import Head from 'next/head';
import { LayoutType, Page, ScopeType } from 'components';

const MyPage = () => (
  <Page scope={ScopeType.PRIVATE} layout={LayoutType.MAIN}>
    <Head>
      <title>My Page</title>
    </Head>
    <div className="p-4 sm:p-6">{/* content */}</div>
  </Page>
);
export default MyPage;
```

`<Page>` wrapper is **required**. It handles auth gating, layout selection, and account fetching.

---

## Import Conventions

`tsconfig.baseUrl` is `src`. Paths alias: `@/*` → `src/*`.

```tsx
import { apiClient } from 'services/api-client.service'; // ✅ bare
import { useApiQuery } from 'hooks'; // ✅ bare
import { Button } from '@/components/ui/button'; // ✅ @/ alias for ui
import { Table, Page, ScopeType } from 'components'; // ✅ barrel
import config from 'config'; // ✅ bare
```

---

## Component Organization

| Location                   | Scope                | Import pattern              |
| -------------------------- | -------------------- | --------------------------- |
| `src/components/ui/`       | shadcn/ui primitives | `@/components/ui/button`    |
| `src/components/`          | Shared components    | `'components'` (barrel)     |
| `pages/<name>/components/` | Page-scoped          | Relative import within page |

**Don't modify shadcn/ui files** unless necessary. Wrap instead.
Add new shadcn components via: `npx shadcn@latest add <component>` (from `apps/web/`).

---

## Styling Rules

- **Tailwind CSS only**. No CSS modules, no styled-components.
- `cn()` from `@/lib/utils` for conditional class merging.
- Mobile-first: `sm:`, `md:`, `lg:` breakpoints.
- Dark mode: semantic CSS variables (`text-foreground`, `bg-background`, `text-muted-foreground`, `border`, etc.).
- Icons: `lucide-react` (`import { Icon } from 'lucide-react'`).

---

## Environment & Services

- Env vars **must** use `NEXT_PUBLIC_` prefix. Validated in `src/config/index.ts`.
- Socket.IO client: `src/services/socket.service.ts`. Handlers in `socket-handlers.ts` (imported as side-effect in PageConfig).
- Toasts: Sonner (`import { toast } from 'sonner'`). Already set up in `_app`.
- Theming: `next-themes` (system/light/dark). Use CSS variables, not hardcoded colors.

---

## Verification

```bash
pnpm --filter web tsc --noEmit    # typecheck
pnpm --filter web eslint .        # lint
pnpm --filter web build           # full build (catches SSR issues)
```

---

## Update Triggers

Update this file when:

- `next.config.mjs` changes (pageExtensions, i18n, output mode)
- `_app/PageConfig` changes (new scope types, layouts)
- shadcn/ui configuration changes (`components.json`)
- New shared component patterns emerge
- Tailwind config changes significantly
