# Web: Pages & Data Access

> Read this when adding or modifying web pages, consuming API data, or working with forms.

---

## Page File Convention

**Only `*.page.tsx` files are treated as routes** (configured in `next.config.mjs` → `pageExtensions`).

- `pages/projects/index.page.tsx` → route `/projects`
- `pages/projects/[id].page.tsx` → route `/projects/:id`
- `pages/projects/components/List.tsx` → **NOT a route** (no `.page.tsx` extension)

This is the most common agent mistake. A file named `index.tsx` inside `pages/` will **not** be routed.

---

## Page Wrapper (Required)

Every page must wrap its content in the `Page` component:

```tsx
import { LayoutType, Page, ScopeType } from 'components';

const MyPage = () => (
  <Page scope={ScopeType.PRIVATE} layout={LayoutType.MAIN}>
    {/* content */}
  </Page>
);
export default MyPage;
```

| Scope | Effect |
|-------|--------|
| `PRIVATE` | Requires auth — redirects to `/sign-in` if not logged in |
| `PUBLIC` | Non-auth only — redirects to `/` if already logged in |

| Layout | Effect |
|--------|--------|
| `MAIN` | App shell with sidebar navigation |
| `UNAUTHORIZED` | Centered layout for auth pages |

Import from `'components'` (barrel at `src/components/index.ts`).

---

## Data Fetching

The typed API client is auto-generated from API endpoints. Import from `services/api-client.service`:

```tsx
import { apiClient } from 'services/api-client.service';
```

### Queries (GET)

```tsx
import { useApiQuery } from 'hooks';

const { data, isLoading } = useApiQuery(apiClient.projects.list);
const { data } = useApiQuery(apiClient.projects.list, { page: 1, perPage: 10 });
```

### Mutations (POST/PUT/DELETE)

```tsx
import { useApiMutation } from 'hooks';

const { mutate, isPending } = useApiMutation(apiClient.projects.create);
mutate({ name: 'New' }, { onError: (e) => handleApiError(e, setError) });
```

### Dynamic Path Params Gotcha

`useApiMutation` binds `pathParams` at **hook level** — they're fixed for all `mutate()` calls. For dynamic IDs (e.g., deleting different items in a list), use `endpoint.call()` directly:

```tsx
// ✅ Dynamic pathParams — use .call()
const handleDelete = async (id: string) => {
  await apiClient.projects.remove.call({}, { pathParams: { id } });
  queryClient.invalidateQueries({ queryKey: [apiClient.projects.list.path] });
};

// ✅ Fixed pathParams — hook level is fine
const { mutate: update } = useApiMutation(apiClient.projects.update, {
  pathParams: { id: projectId },
});
```

### Forms

```tsx
import { useApiForm, useApiMutation } from 'hooks';

const form = useApiForm(apiClient.projects.create); // auto-resolves Zod schema
const { mutate } = useApiMutation(apiClient.projects.create);
const onSubmit = form.handleSubmit((data) =>
  mutate(data, { onError: (e) => handleApiError(e, form.setError) })
);
```

### Streaming (SSE)

```tsx
import { useApiStreamMutation } from 'hooks';
const { mutate, isLoading } = useApiStreamMutation(apiClient.chats.sendMessage);
mutate({ content: 'Hi' }, { pathParams: { chatId }, onToken: (t) => {}, onDone: (d) => {} });
```

---

## Query Invalidation

```tsx
import queryClient from 'query-client';

queryClient.invalidateQueries({ queryKey: [apiClient.projects.list.path] });
queryClient.setQueryData([apiClient.account.get.path], updatedData);
```

Query keys = `[endpoint.path, ...params]`. The first element is always the endpoint path string.

---

## Error Handling

`handleApiError(e, setError)` from `utils`:
- Maps server validation errors → react-hook-form field errors
- Shows global errors via Sonner toast

---

## Verification

After web changes:
```bash
pnpm --filter web tsc --noEmit    # type errors
pnpm --filter web eslint .        # lint
pnpm --filter web build           # full build passes
```

---

## Update Triggers

Update this doc when: `pageExtensions`, `PageConfig`, `useApi*` hook signatures, or `handleApiError` behavior changes.
