import { createORPCClient } from '@orpc/client';
import { OpenAPILink } from '@orpc/openapi-client/fetch';
import type { AppClient } from 'api';
import { contract } from 'api/contract';

import config from 'config';

const link = new OpenAPILink(contract, {
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

// Stable-identity wrapper: oRPC proxies create new objects on every access,
// so we cache children and track paths via a symbol for query key derivation.
export const ORPC_PATH = Symbol('orpc-path');

function createStableClient<T>(target: T, path: string[] = []): T {
  const cache = new Map<string, unknown>();

  // eslint-disable-next-line ts/no-explicit-any
  return new Proxy((() => {}) as any, {
    get(_, prop: string | symbol) {
      if (prop === ORPC_PATH) return path;
      if (typeof prop === 'symbol' || prop === 'then') return undefined;

      if (!cache.has(prop)) {
        // eslint-disable-next-line ts/no-explicit-any
        cache.set(prop, createStableClient((target as any)[prop], [...path, prop]));
      }
      return cache.get(prop);
    },
    apply(_, __, args) {
      // eslint-disable-next-line ts/no-explicit-any
      return (target as any)(...args);
    },
  }) as T;
}

export const orpc = createStableClient(createORPCClient<AppClient>(link));
export const apiClient = orpc;
