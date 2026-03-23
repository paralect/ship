import type { RouterClient } from '@orpc/server';

import * as account from './resources/account/procedures';
import * as users from './resources/users/procedures';
import { pub } from './procedures';

export const router = pub.router({
  account: pub.router(account),
  users: pub.router(users),
});

export type Router = typeof router;
export type AppClient = RouterClient<Router>;
