import { OAuth2Client } from 'google-auth-library';

import config from 'config';

const client = new OAuth2Client(
  config.google.clientId,
  config.google.clientSecret,
  `${config.apiUrl}/account/sign-in/google`,
);

const oAuthURL = client.generateAuthUrl({
  access_type: 'offline',
  scope: ['email', 'profile'],
  include_granted_scopes: true,
});

const exchangeCodeForToken = async (code: string) => {
  try {
    const { tokens } = await client.getToken(code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token || '',
      audience: config.google.clientId,
    });

    return {
      isValid: true,
      payload: ticket.getPayload(),
    };
  } catch ({ message, ...rest }) {
    return {
      isValid: false,
      payload: { message },
    };
  }
};


export default {
  oAuthURL,
  exchangeCodeForToken,
};

