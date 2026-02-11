import type { AppKoaContext, Next } from 'types';

import type { TypedMiddleware } from './types';

// eslint-disable-next-line ts/no-explicit-any
export default function createMiddleware<TState = object>(
  fn: (ctx: any, next: Next) => Promise<void>,
): TypedMiddleware<TState> {
  return fn as TypedMiddleware<TState>;
}
