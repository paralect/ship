import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';

import type { AppClient } from 'api';

import config from 'config';

const link = new RPCLink({
  url: config.API_URL,
  headers: () => ({
    'Content-Type': 'application/json',
  }),
  fetch: (input, init) =>
    fetch(input, {
      ...init,
      credentials: 'include',
    }),
});

const rawClient = createORPCClient<AppClient>(link);

// Stable-identity wrapper: oRPC proxies create new objects on every access,
// so we cache children and track paths via a symbol for query key derivation.
export const ORPC_PATH = Symbol('orpc-path');

function createStableClient<T>(target: T, path: string[] = []): T {
  const cache = new Map<string, unknown>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Proxy((() => {}) as any, {
    get(_, prop: string | symbol) {
      if (prop === ORPC_PATH) return path;
      if (typeof prop === 'symbol' || prop === 'then') return undefined;

      if (!cache.has(prop)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cache.set(prop, createStableClient((target as any)[prop], [...path, prop]));
      }
      return cache.get(prop);
    },
    apply(_, __, args) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (target as any)(...args);
    },
  }) as T;
}

export const orpc = createStableClient(rawClient);
export const apiClient = orpc;
