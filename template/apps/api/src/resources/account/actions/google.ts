import { AppRouter, AppKoaContext } from 'types';

import { userService } from 'resources/user';

import { googleService, authService } from 'services';

import config from 'config';

type ValidatedData = {
  given_name: string;
  family_name: string;
  email: string;
  picture: string
};

const getOAuthUrl = async (ctx: AppKoaContext) => {
  const isValidCredentials = config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET;

  ctx.assertClientError(isValidCredentials, {
    global: 'Setup Google Oauth credentials on API',
  });

  ctx.redirect(googleService.oAuthURL);
};

const signInGoogleWithCode = async (ctx: AppKoaContext) => {
  const { code } = ctx.request.query;

  const { isValid, payload } = await googleService.
    exchangeCodeForToken(code as string) as { isValid: boolean, payload: ValidatedData };

  ctx.assertError(isValid, `Exchange code for token error: ${payload}`);

  const user = await userService.findOne({ email: payload.email });
  let userChanged;

  if (user) {
    if (!user.oauth?.google) {
      userChanged = await userService.updateOne(
        { _id: user._id },
        (old) => ({ ...old, oauth: { google: true } }),
      );
    }
    const userUpdated = userChanged || user;
    await Promise.all([
      userService.updateLastRequest(userUpdated._id),
      authService.setTokens(ctx, userUpdated._id),
    ]);

  } else {
    const lastName = payload.family_name || '';
    const fullName = lastName ? `${payload.given_name} ${lastName}` : payload.given_name;

    const newUser = await userService.insertOne({
      firstName: payload.given_name,
      lastName,
      fullName,
      email: payload.email,
      isEmailVerified: true,
      avatarUrl: payload.picture,
      oauth: {
        google: true,
      },
    });

    if (newUser) {
      await Promise.all([
        userService.updateLastRequest(newUser._id),
        authService.setTokens(ctx, newUser._id),
      ]);
    }
  }

  ctx.redirect(config.WEB_URL);
};



export default (router: AppRouter) => {
  router.get('/sign-in/google/auth', getOAuthUrl);
  router.get('/sign-in/google', signInGoogleWithCode);
};
