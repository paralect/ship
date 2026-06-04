import { os } from '@orpc/server';

import globalMiddlewares from '@/middlewares/global';
import type { ORPCContext } from '@/types';

const base = os.$context<ORPCContext>();

// The builder type after global (context-preserving) middlewares are applied.
type Endpoint = ReturnType<typeof base.use>;

// Entry point every endpoint builds on. Every middleware in `@/middlewares/global` is applied
// here by default, before any per-endpoint `.use(...)` (gates, ownership). Add an always-on
// middleware by registering it in `middlewares/global` — nothing changes here.
export default globalMiddlewares.reduce<Endpoint>(
  // eslint-disable-next-line ts/no-explicit-any
  (builder, middleware) => (builder as any).use(middleware),
  base as unknown as Endpoint,
);
