import config from 'config';
import { userService } from 'resources/user';
import { googleService, authService } from 'services';
import { AppRouter, AppKoaContext } from 'types';

type ValidatedData = {
  given_name: string;
  family_name: string;
  email: string;
};

const createUserAccount = async (userData: ValidatedData) => {
  const user = await userService.insertOne({
    firstName: userData.given_name,
    lastName: userData.family_name,
    fullName: `${userData.given_name} ${userData.family_name}`,
    email: userData.email,
    isEmailVerified: true,
    oauth: {
      google: true,
    },
  });

  return user;
};

const getOAuthUrl = async (ctx: AppKoaContext) => {
  ctx.redirect(googleService.oAuthURL);
};

const ensureAccountCreated = async (payload: ValidatedData) => {
  const user = await userService.findOne({ email: payload.email });

  if (user) {
    if (!user.oauth?.google) {
      const userChanged = await userService.updateOne(
        { _id: user._id },
        (old) => ({ ...old, oauth: { google: true } }),
      );

      return userChanged;
    }

    return user;
  }

  return createUserAccount(payload);
};

const signinGoogleWithCode = async (ctx: AppKoaContext) => {
  const { code } = ctx.request.query;

  const { isValid, payload } = await googleService.exchangeCodeForToken(code as string);

  ctx.assert(isValid, 404);

  const user = await ensureAccountCreated(payload as ValidatedData);

  if (user){
    await Promise.all([
      userService.updateLastRequest(user._id),
      authService.setTokens(ctx, user._id),
    ]);
  }
  ctx.redirect(config.webUrl);
};



export default (router: AppRouter) => {
  router.get('/sign-in/google/auth', getOAuthUrl);
  router.get('/sign-in/google', signinGoogleWithCode);
};
  