# Web: Pages & Data Access

> Read this when adding or modifying web pages, consuming API data, or working with forms.

---

## Page File Convention

**Only `*.page.tsx` files are treated as routes** (configured in `next.config.mjs` → `pageExtensions`).

- `pages/projects/index.page.tsx` → route `/projects`
- `pages/projects/[id].page.tsx` → route `/projects/:id`
- `pages/projects/components/List.tsx` → not a route (no `.page.tsx`)

---

## Page Wrapper (Required)

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

---

## Data Fetching (oRPC)

The API client is typed via oRPC declarations. Import from:

```tsx
import { apiClient } from 'services/api-client.service';
```

### Queries

```tsx
import { useApiQuery } from 'hooks';

const { data, isLoading } = useApiQuery(apiClient.account.get);
const { data } = useApiQuery(apiClient.users.list, { page: 1, perPage: 10 });
```

### Mutations

```tsx
import { useApiMutation } from 'hooks';

const { mutate, isPending } = useApiMutation(apiClient.account.signUp);
mutate({ email, password, firstName, lastName });
```

### Forms

```tsx
import { useApiForm, useApiMutation } from 'hooks';

const form = useApiForm(zodSchema);
const { mutate } = useApiMutation(apiClient.account.signUp);
const onSubmit = form.handleSubmit((data) =>
  mutate(data, { onError: (e) => handleApiError(e, form.setError) })
);
```

---

## Query Keys & Invalidation

Query keys are derived automatically from the procedure path:

```tsx
import { queryKey } from 'hooks';
import queryClient from 'query-client';

// Invalidate
queryClient.invalidateQueries({ queryKey: queryKey(apiClient.users.list) });

// Set data directly
queryClient.setQueryData(queryKey(apiClient.account.get), updatedUser);
```

---

## Error Handling

`handleApiError(e, setError)` from `utils` maps server validation errors to react-hook-form field errors and shows global errors via Sonner toast.

---

## Verification

```bash
pnpm --filter web tsc --noEmit
pnpm --filter web build
```
