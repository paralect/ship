const userService = require('resources/user/user.service');
const authService = require('auth.service');
const emailService = require('email.service');

const securityUtil = require('security.util');
const config = require('config');

const createUserAccount = async (userData) => {
  const salt = await securityUtil.generateSalt();

  const [hash, signupToken] = await Promise.all([
    securityUtil.getHash(userData.password, salt),
    securityUtil.generateSecureToken(),
  ]);

  const user = await userService.create({
    firstName: userData.firstName,
    lastName: userData.lastName,
    passwordHash: hash.toString(),
    passwordSalt: salt.toString(),
    email: userData.email,
    isEmailVerified: false,
    signupToken,
  });

  await emailService.sendSignupWelcome({ email: user.email, signupToken });

  return user;
};

/**
 * Create user, company, default app, send signup confirmation email and
 * create auth token for user to login
 */
exports.signup = async (ctx) => {
  const userData = ctx.validatedRequest.value;
  const user = await createUserAccount(userData);

  const response = {};
  if (config.isDev) {
    response._signupToken = user.signupToken;
  }
  ctx.body = response;
};

/**
 * Verify user's email when user click a link from email
 * sets `emailVerified` to true if token is valid
 */
exports.verifyEmail = async (ctx, next) => {
  const data = ctx.validatedRequest.value;
  const user = await userService.markEmailAsVerified(data.userId);

  const token = authService.createAuthToken({
    userId: user._id,
  });
  const loginUrl = `${config.webUrl}?token=${token}`;

  ctx.redirect(`${loginUrl}&emailVerification=true`);
};

/**
 * Sign in user
 * Loads user by email and compare password hashes
 */
exports.signin = async (ctx, next) => {
  const signinData = ctx.validatedRequest.value;

  const token = authService.createAuthToken({ userId: signinData.userId });

  ctx.body = {
    token,
  };
};

/**
 * Send forgot password email with a unique link to set new password
 * If user is found by email - sends forgot password email and update
 * `forgotPasswordToken` field. If user not found, returns validator's error
 */
exports.forgotPassword = async (ctx, next) => {
  const data = ctx.validatedRequest.value;
  const user = await userService.findOne({ email: data.email });

  let { resetPasswordToken } = user;
  const { firstName } = user;
  if (!resetPasswordToken) {
    resetPasswordToken = await securityUtil.generateSecureToken();
    await userService.updateResetPasswordToken(user._id, resetPasswordToken);
  }

  await emailService.sendForgotPassword({
    email: user.email,
    resetPasswordToken,
    firstName,
  });

  ctx.body = {};
};

/**
 * Updates user password, used in combination with forgotPassword
 */
exports.resetPassword = async (ctx, next) => {
  const { userId, password } = ctx.validatedRequest.value;

  await userService.updatePassword(userId, password);
  await userService.updateResetPasswordToken(userId, '');

  ctx.body = {};
};

exports.resendVerification = async (ctx, next) => {
  const { email } = ctx.request.body;
  const user = await userService.findOne({ email });

  if (user) {
    await emailService.sendSignupWelcome({ email, signupToken: user.signupToken });
  }

  ctx.body = {};
};
