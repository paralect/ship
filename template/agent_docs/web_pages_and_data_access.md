# Web: Pages & Data Access

> Read this when adding or modifying web pages, consuming API data, or working with forms.

Stack: **TanStack Start** (SPA mode) + **TanStack Router** (file-based) + **TanStack Query** + **oRPC client** + **react-hook-form** + **zod** + **shadcn/ui** + **Tailwind v4**.

---

## Route File Convention (TanStack Router)

Routes live in [`apps/web/src/routes/`](../apps/web/src/routes/). The Vite plugin (`@tanstack/react-start/plugin/vite`) regenerates `src/routeTree.gen.ts` on save.

- `src/routes/index.tsx` → `/` (public landing)
- `src/routes/sign-in.tsx` → `/sign-in`
- `src/routes/_authenticated.tsx` → guarded layout (auth required; redirects to `/sign-in`)
- `src/routes/_authenticated/app/index.tsx` → `/app` (dashboard)
- `src/routes/_authenticated/app/settings/profile.tsx` → `/app/settings/profile`
- `src/routes/$.tsx` → catch-all 404

Routes that are not files: anything under `-components/` (the leading `-` tells TanStack Router to skip it). Use that pattern for route-private helpers.

Each route file exports `Route` via `createFileRoute(...)` and a component:

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/app/admin/')({
  component: AdminPage,
});

function AdminPage() {
  return <div>…</div>;
}
```

Root shell + providers live in [`src/routes/__root.tsx`](../apps/web/src/routes/__root.tsx). The HTML document is rendered by `shellComponent: RootDocument` (TanStack Start handles `<html>`/`<head>`/`<body>` — no `index.html` in the source).

---

## Data Fetching (oRPC + TanStack Query)

Client lives at [`src/services/api-client.service.ts`](../apps/web/src/services/api-client.service.ts). Hooks live at [`src/hooks/use-api.hook.ts`](../apps/web/src/hooks/use-api.hook.ts).

### Queries

```tsx
import { useApiQuery } from '@/hooks';
import { apiClient } from '@/services/api-client.service';

const { data, isLoading } = useApiQuery(apiClient.users.getCurrent);
const { data } = useApiQuery(apiClient.users.list, { page: 1, perPage: 10 });
```

### Mutations

```tsx
import { useApiMutation } from '@/hooks';

const { mutate, isPending } = useApiMutation(apiClient.users.patchCurrent);
mutate({ fullName: 'New Name' });
```

### Forms (react-hook-form + zod)

```tsx
import { useApiForm, useApiMutation } from '@/hooks';

const form = useApiForm(zodSchema);
const { mutate } = useApiMutation(apiClient.users.patchCurrent);

const onSubmit = form.handleSubmit((data) =>
  mutate(data, { onError: (e) => handleApiError(e, form.setError) }),
);
```

---

## Query Keys & Invalidation

`queryKey(procedure, input?)` derives a stable key from the oRPC path:

```tsx
import { queryKey } from '@/hooks';
import queryClient from '@/query-client';

queryClient.invalidateQueries({ queryKey: queryKey(apiClient.users.list) });
queryClient.setQueryData(queryKey(apiClient.users.getCurrent), updatedUser);
```

Socket events (`'user:updated'`) auto-invalidate the current-user query — see `src/hooks/use-current-user.hook.ts`.

---

## Reusable Widgets

| Widget | File | When to use |
|---|---|---|
| `Table` (TanStack Table wrapper) | `src/components/Table` | Any paginated list. Pass `data`, `columns`, `page`, `perPage`, `onSortingChange`, `onPageChange`, optional `onRowClick`. |
| `AppDrawer` | `src/components/app-drawer.tsx` | Right-side sheet for forms/details. Slots: header (`title`), body (children), footer buttons (`submitLabel`/`cancelLabel`). |
| `PillTabBar` | `src/components/pill-tab-bar.tsx` | Tab navigation with rounded grey-on-active background. |
| `ContentLayout` | `src/layouts/main-layout/content-layout.tsx` | Detail-page chrome (back button + bordered white card). |
| shadcn primitives | `src/components/ui/*` | Buttons, dialogs, dropdowns, popovers, etc. |

Components consume chambers-derived tokens from [`src/globals.css`](../apps/web/src/globals.css) — see `--color-bg-neutral-grey-*`, `--color-border-tertiary`, `--color-text-secondary`, etc.

---

## Error Handling

Server validation errors flow back as oRPC `BAD_REQUEST` with a `data.errors` payload. `handleApiError(e, setError)` maps those onto react-hook-form fields and shows global errors via Sonner toast.

---

## Verification

```bash
pnpm --filter web tsc --noEmit
pnpm --filter web build
```
