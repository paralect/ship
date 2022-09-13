import { routeUtil } from 'utils';

import signUp from './actions/sign-up';
import signIn from './actions/sign-in';
import signOut from './actions/sign-out';
import verifyEmail from './actions/verify-email';
import forgotPassword from './actions/forgot-password';
import resetPassword from './actions/reset-password';
import verifyResetToken from './actions/verify-reset-token';
import resendEmail from './actions/resend-email';
import shadowLogin from './actions/shadow-login';
import google from './actions/google';

const publicRoutes = routeUtil.getRoutes([
  signUp,
  signIn,
  signOut,
  verifyEmail,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  resendEmail,
  google,
]);

const adminRoutes = routeUtil.getRoutes([
  shadowLogin,
]);

export default {
  adminRoutes,
  publicRoutes,
};
