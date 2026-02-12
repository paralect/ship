import type { Next } from 'types';

import type { TypedMiddleware } from './types';

export default function createMiddleware<TState = object>(
  // eslint-disable-next-line ts/no-explicit-any
  fn: (ctx: any, next: Next) => Promise<void>,
): TypedMiddleware<TState> {
  return fn as TypedMiddleware<TState>;
}
