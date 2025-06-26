export const DATABASE_DOCUMENTS = {
  USERS: 'users',
  TOKENS: 'tokens',
};

export const COOKIES = {
  ACCESS_TOKEN: 'access_token',
};

export const ACCESS_TOKEN = {
  // The maximum lifetime of an access token, regardless of user activity
  ABSOLUTE_EXPIRATION_SECONDS: 60 * 60 * 24 * 30, // 30 days
  // The duration after which an unused access token expires due to inactivity
  INACTIVITY_TIMEOUT_SECONDS: 60 * 60 * 24 * 10, // 10 days
  // How often the system checks for user activity to determine if the token should be prolonged
  ACTIVITY_CHECK_INTERVAL_SECONDS: 60 * 60 * 24, // 1 day
};

export const EMAIL_VERIFICATION_TOKEN = {
  EXPIRATION_SECONDS: 60 * 60 * 24, // 1 day
};

export const RESET_PASSWORD_TOKEN = {
  EXPIRATION_SECONDS: 60 * 60 * 3, // 3 hours
};
