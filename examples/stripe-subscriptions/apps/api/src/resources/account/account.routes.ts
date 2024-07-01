import { routeUtil } from 'utils';

import forgotPassword from './actions/forgot-password';
import get from './actions/get';
import google from './actions/google';
import removeAvatar from './actions/remove-avatar';
import resendEmail from './actions/resend-email';
import resetPassword from './actions/reset-password';
import shadowLogin from './actions/shadow-login';
import signIn from './actions/sign-in';
import signOut from './actions/sign-out';
import signUp from './actions/sign-up';
import update from './actions/update';
import uploadAvatar from './actions/upload-avatar';
import verifyEmail from './actions/verify-email';
import verifyResetToken from './actions/verify-reset-token';

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

const privateRoutes = routeUtil.getRoutes([get, update, uploadAvatar, removeAvatar]);

const adminRoutes = routeUtil.getRoutes([shadowLogin]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
