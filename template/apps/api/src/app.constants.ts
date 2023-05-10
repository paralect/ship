const DATABASE_DOCUMENTS = {
  USERS: 'users',
  TOKENS: 'tokens',
};

const COOKIES = {
  ACCESS_TOKEN: 'access_token',
};

const TOKEN_SECURITY_LENGTH = 32;

const PASSWORD_REGEXP = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/g;

export {
  DATABASE_DOCUMENTS,
  COOKIES,
  TOKEN_SECURITY_LENGTH,
  PASSWORD_REGEXP,
};
