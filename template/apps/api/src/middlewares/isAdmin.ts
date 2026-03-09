import createMiddleware from 'routes/createMiddleware';

import config from 'config';

import { AppKoaContextState } from 'types';

interface AdminState extends AppKoaContextState {
  isAdmin: true;
}

const isAdmin = createMiddleware<AdminState>(async (ctx, next) => {
  const adminKey = ctx.header['x-admin-key'];

  if (config.ADMIN_KEY && config.ADMIN_KEY === adminKey) {
    (ctx.state as AdminState).isAdmin = true;
    return next();
  }

  ctx.status = 401;
});

export default isAdmin;
