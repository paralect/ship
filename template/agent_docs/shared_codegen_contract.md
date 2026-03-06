# Shared Package: Codegen Contract

> Read this before modifying API endpoints/schemas, or when types seem stale/missing.

---

## What Codegen Does

The script `packages/shared/scripts/generate.ts` bridges API → Web with zero manual types:

1. **Copies schemas**: All `*.schema.ts` (and `*.extend.ts`) from `apps/api/src/resources/` → `packages/shared/src/schemas/`
2. **Scans endpoints**: Reads each `resources/*/endpoints/*.ts` — extracts method, path, schema, path params
3. **Infers return types**: Uses the TypeScript compiler API to statically infer handler return types
4. **Generates**: `packages/shared/src/generated/index.ts` — typed endpoint descriptors, param types, response types, `createApiEndpoints()` factory

---

## Commands

```bash
pnpm --filter shared generate          # one-shot (CI, after changes)
pnpm --filter shared generate:watch    # dev mode (watches API resources)
```

---

## When to Run

Run `pnpm --filter shared generate` after **any** of:
- Adding, removing, or modifying files in `apps/api/src/resources/*/endpoints/`
- Adding or modifying `*.schema.ts` files in API resources
- Changing an endpoint's method, path, schema, or handler return type

**Not running this** = stale types → web won't compile or will have wrong types.

---

## What's Generated (Never Hand-Edit)

| Path | Contents |
|------|----------|
| `packages/shared/src/generated/index.ts` | Schemas, `*Params`, `*PathParams`, `*Response` types, `createApiEndpoints()` |
| `packages/shared/src/schemas/*.ts` | Copies of API schema files (overwritten each run) |

These files are **overwritten entirely** on every generation. Any manual edit will be lost.

## What's Hand-Written (Safe to Edit)

| Path | Contents |
|------|----------|
| `packages/shared/src/client.ts` | `ApiClient` Axios wrapper, `ApiError` class |
| `packages/shared/src/types.ts` | Shared utility types (`ListResult`, `SortParams`, etc.) |
| `packages/shared/src/constants.ts` | Shared constants |
| `packages/shared/scripts/generate.ts` | The generator itself |

---

## How to Detect Stale Code

Symptoms:
- Web typecheck fails with "property X does not exist on apiClient.resource"
- Import from `'shared'` can't find a `*Params` or `*Response` type
- Endpoint exists in API but `apiClient` doesn't have it

Fix: `pnpm --filter shared generate`, then `pnpm --filter web tsc --noEmit`.

---

## Ignored Resources

The `IGNORE_RESOURCES` array in `generate.ts` currently contains `["token"]`. Resources in this list are excluded from route registration and codegen. Check the array if a resource seems invisible to codegen.

---

## Consuming Generated Types (Web)

```typescript
// Endpoint functions
import { apiClient } from 'services/api-client.service';
apiClient.projects.list       // typed: params, pathParams, response

// Types
import type { ProjectsCreateParams, ProjectsListResponse } from 'shared';

// Schemas (for client-side validation)
import { schemas } from 'shared';
schemas.account.signUp        // Zod schema
```

---

## Verification

```bash
pnpm --filter shared generate         # regenerate
pnpm --filter shared tsc --noEmit     # shared compiles
pnpm --filter web tsc --noEmit        # web compiles with new types
```

---

## Update Triggers

Update this doc when:
- `generate.ts` scanning logic changes (new file patterns, new output structure)
- `IGNORE_RESOURCES` list changes
- Output file locations change
- New exports are added to the generated file
