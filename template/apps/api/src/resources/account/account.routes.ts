import { routeUtil } from 'utils';

import get from './actions/get';
import update from './actions/update';
import uploadAvatar from './actions/upload-avatar';
import removeAvatar from './actions/remove-avatar';
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

const privateRoutes = routeUtil.getRoutes([
  get,
  update,
  uploadAvatar,
  removeAvatar,
]);

const adminRoutes = routeUtil.getRoutes([
  shadowLogin,
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
