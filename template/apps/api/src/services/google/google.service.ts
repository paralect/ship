import {
  ArcticFetchError,
  decodeIdToken,
  generateCodeVerifier,
  generateState,
  Google,
  OAuth2RequestError,
  OAuth2Tokens,
  // @ts-expect-error - `arctic` is an ESM-only package, but `ts-node` can handle this import.
} from 'arctic';
import { z } from 'zod';

import { userService } from 'resources/user';

import config from 'config';

import logger from 'logger';

import { User } from 'types';

const googleUserInfoSchema = z.object({
  sub: z.string().describe('Unique Google user ID'),
  email: z.string().email().describe('User email'),
  email_verified: z.boolean().describe('Email verification status'),
  name: z.string().describe('User full name'),
  picture: z.string().url().describe('Profile picture URL').optional(),
  given_name: z.string().describe('First name'),
  family_name: z.string().describe('Last name'),
});

const googleCallbackParamsSchema = z
  .object({
    code: z.string(),
    state: z.string(),
    storedState: z.string(),
    codeVerifier: z.string(),
  })
  .refine((data) => data.state === data.storedState, { message: 'OAuth state mismatch' });

export const googleClient = new Google(
  config.GOOGLE_CLIENT_ID!,
  config.GOOGLE_CLIENT_SECRET!,
  `${config.API_URL}/account/sign-in/google/callback`,
);

type GoogleUserData = {
  googleUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  avatarUrl?: string;
};

const handleExistingUser = async (userId: string): Promise<User | null> => {
  const existingUser = await userService.findOne({ 'oauth.google.userId': userId });

  if (existingUser) {
    await userService.updateLastRequest(existingUser._id);

    return existingUser;
  }

  return null;
};

const handleExistingUserByEmail = async (email: string, googleUserId: string): Promise<User | null> => {
  const existingUserByEmail = await userService.findOne({ email });

  if (existingUserByEmail) {
    await userService.updateOne({ _id: existingUserByEmail._id }, () => ({
      oauth: {
        google: {
          userId: googleUserId,
          connectedOn: new Date(),
        },
      },
    }));

    await userService.updateLastRequest(existingUserByEmail._id);

    return existingUserByEmail;
  }

  return null;
};

const createNewUser = async (userData: GoogleUserData): Promise<User | null> => {
  const { firstName, lastName, email, isEmailVerified, avatarUrl, googleUserId } = userData;

  return userService.insertOne({
    firstName,
    lastName,
    email,
    isEmailVerified,
    avatarUrl,
    oauth: { google: { userId: googleUserId, connectedOn: new Date() } },
  });
};

export const createAuthUrl = () => {
  const areCredentialsExist = config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET;

  if (!areCredentialsExist) {
    throw new Error('Google OAuth credentials are not setup');
  }

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const authorizationUrl = googleClient.createAuthorizationURL(state, codeVerifier, ['openid', 'profile', 'email']);

  return {
    state,
    codeVerifier,
    authorizationUrl: authorizationUrl.toString(),
  };
};

export const validateCallback = async (params: {
  code: string | undefined;
  state: string | undefined;
  storedState: string | undefined;
  codeVerifier: string | undefined;
}): Promise<User | null> => {
  const parsedParams = googleCallbackParamsSchema.safeParse({
    code: params.code,
    state: params.state,
    storedState: params.storedState,
    codeVerifier: params.codeVerifier,
  });

  if (!parsedParams.success) {
    const errorMessage = 'Failed to validate Google authentication data.';

    logger.error(`[Google OAuth] ${errorMessage}`);
    logger.error(parsedParams.error.flatten().fieldErrors);

    throw new Error(errorMessage);
  }

  const { code, codeVerifier } = parsedParams.data;

  let tokens: OAuth2Tokens;

  try {
    tokens = await googleClient.validateAuthorizationCode(code, codeVerifier);
  } catch (e) {
    let errorMessage = 'An error occurred during Google authentication';

    if (e instanceof OAuth2RequestError) {
      const { code: errorCode, description } = e;

      errorMessage = `Google authentication failed: ${description || errorCode}`;
    } else if (e instanceof ArcticFetchError) {
      errorMessage = 'Failed to connect to Google authentication service';
    }

    logger.error(`[Google OAuth] ${errorMessage}`);
    throw new Error(errorMessage);
  }

  const claims = decodeIdToken(tokens.idToken());
  const parsedUserInfo = googleUserInfoSchema.safeParse(claims);

  if (!parsedUserInfo.success) {
    const errorMessage = 'Failed to validate Google user info';

    logger.error(`[Google OAuth] ${errorMessage}`);
    logger.error(parsedUserInfo.error.flatten().fieldErrors);

    throw new Error(errorMessage);
  }

  const {
    sub: googleUserId,
    email,
    email_verified: isEmailVerified,
    picture: avatarUrl,
    given_name: firstName,
    family_name: lastName,
  } = parsedUserInfo.data;

  if (!isEmailVerified) {
    throw new Error('Google account is not verified');
  }

  const existingUser = await handleExistingUser(googleUserId);

  if (existingUser) return existingUser;

  const existingUserByEmail = await handleExistingUserByEmail(email, googleUserId);

  if (existingUserByEmail) return existingUserByEmail;

  return createNewUser({
    firstName,
    lastName,
    email,
    isEmailVerified,
    avatarUrl,
    googleUserId,
  });
};
