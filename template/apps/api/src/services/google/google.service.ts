import {
  ArcticFetchError,
  decodeIdToken,
  generateCodeVerifier,
  generateState,
  Google,
  OAuth2RequestError,
  OAuth2Tokens,
} from 'arctic';
import { z } from 'zod';

import config from '@/config';
import logger from '@/logger';

const googleUserInfoSchema = z.object({
  sub: z.string().describe('Unique Google user ID'),
  email: z.email().describe('User email'),
  email_verified: z.boolean().describe('Email verification status'),
  name: z.string().describe('User full name'),
  picture: z.url().describe('Profile picture URL').optional(),
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
  .refine((data) => data.state === data.storedState, { error: 'OAuth state mismatch' });

export const googleClient = new Google(
  config.GOOGLE_CLIENT_ID!,
  config.GOOGLE_CLIENT_SECRET!,
  `${config.API_URL}/account/sign-in/google/callback`,
);

export interface GoogleUserData {
  googleUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  avatarUrl?: string;
}

const parseGoogleUserInfo = (claims: object): GoogleUserData => {
  const parsedUserInfo = googleUserInfoSchema.safeParse(claims);

  if (!parsedUserInfo.success) {
    const errorMessage = 'Failed to validate Google user info';

    logger.error(`[Google OAuth] ${errorMessage}`);
    logger.error(z.treeifyError(parsedUserInfo.error).errors);

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

  return { googleUserId, email, isEmailVerified, avatarUrl, firstName, lastName };
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
}): Promise<GoogleUserData> => {
  const parsedParams = googleCallbackParamsSchema.safeParse({
    code: params.code,
    state: params.state,
    storedState: params.storedState,
    codeVerifier: params.codeVerifier,
  });

  if (!parsedParams.success) {
    const errorMessage = 'Failed to validate Google authentication data.';

    logger.error(`[Google OAuth] ${errorMessage}`);
    logger.error(z.treeifyError(parsedParams.error).errors);

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

  return parseGoogleUserInfo(claims);
};

export const validateIdToken = async (idToken: string): Promise<GoogleUserData> => {
  try {
    const claims = decodeIdToken(idToken);

    return parseGoogleUserInfo(claims);
  } catch (error) {
    logger.error(`[Google OAuth Mobile] ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};
