import { Hono } from 'hono';

import type { HonoEnv } from 'types';

import googleCallback from './googleCallback';
import googleSignIn from './googleSignIn';
import verifyEmail from './verifyEmail';
import verifyResetToken from './verifyResetToken';

const routes = new Hono<HonoEnv>();

routes.get('/sign-in/google', googleSignIn);
routes.get('/sign-in/google/callback', googleCallback);
routes.get('/verify-email', verifyEmail);
routes.get('/verify-reset-token', verifyResetToken);

export default routes;
