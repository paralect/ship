const userService = require('resources/user/user.service');
const authService = require('auth.service');
const googleService = require('resources/account/google/google.service.js');

const config = require('config');

const createUserAccount = async (userData) => {
  const user = await userService.create({
    firstName: userData.given_name,
    lastName: userData.family_name,
    email: userData.email,
    isEmailVerified: true,
    oauth: {
      google: true,
    },
  });

  return user;
};

exports.getOAuthUrl = async (ctx) => {
  ctx.redirect(googleService.oAuthURL);
};

const ensureAccountCreated = async (payload) => {
  const user = await userService.findOne({ email: payload.email });

  if (user) {
    if (!user.oauth.google) {
      const userChanged = await userService.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            oauth: {
              google: true,
            },
          },
        },
      );

      return userChanged;
    }

    return user;
  }

  return createUserAccount(payload);
};

exports.signinGoogleWithCode = async (ctx) => {
  const { code } = ctx.request.query;
  const { isValid, payload } = await googleService.exchangeCodeForToken(code);

  ctx.assert(isValid, 404);

  const user = await ensureAccountCreated(payload);
  const token = authService.createAuthToken({ userId: user._id });

  return ctx.redirect(`${config.webUrl}?token=${token}`);
};
