import { OAuth2Client, TokenPayload } from 'google-auth-library';
import _ from 'lodash';

import { caseUtil } from 'utils';

import config from 'config';

import { ToCamelCase } from 'types';

const client = new OAuth2Client(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  `${config.API_URL}/account/sign-in/google`,
);

const oAuthURL = client.generateAuthUrl({
  access_type: 'offline',
  scope: ['email', 'profile'],
  include_granted_scopes: true,
});

type ConvertedPayload = ToCamelCase<TokenPayload> | undefined;

type ExchangeResponse = {
  isValid: boolean;
  payload: ConvertedPayload | Error | null;
};

const exchangeCodeForToken = async (code?: string | string[] | undefined): Promise<ExchangeResponse> => {
  if (!code || _.isArray(code)) {
    return { isValid: false, payload: new Error('Code not found') };
  }

  try {
    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      return { isValid: false, payload: new Error('ID token not found') };
    }

    const loginTicket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = caseUtil.toCamelCase<ConvertedPayload>(loginTicket.getPayload());

    return { isValid: true, payload };
  } catch (e) {
    if (e instanceof Error) {
      return { isValid: false, payload: e };
    }

    return { isValid: false, payload: new Error(`Unknown error: ${e}`) };
  }
};

export default {
  oAuthURL,
  exchangeCodeForToken,
};
