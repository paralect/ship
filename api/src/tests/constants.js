module.exports = {
  ERRORS: {
    EMAIL_IN_USE: { email: ['This email is already in use'] },
    USER_REGISTRED: { email: ['User with this email is already registered'] },
    INCORRECT_CREDENTIALS: { credentials: ['Incorrect email or password'] },
    INVALID_TOKEN: { token: ['Token is invalid'] },
    EMAIL_NOT_EXISTS: { email: ['Couldn\'t find account associated with such email'] },
    VIRIFY_EMAIL_TO_SIGNIN: { email: ['Please verify your email to sign in'] },
    INCORRECT_EMAIL: { email: ['Please enter a valid email address'] },
    INVALID_RESET_TOKEN: { token: ['Password reset link has expired or invalid'] },
  },
  USER: {
    COLLECTION: 'users',
    DEFAULT_PASSWORD: 'qwerty',
    DEFAULT_SIGNUP_TOKEN: 'signup_token',
    DEFAULT_RESET_PASSWORD_TOKEN: 'reset_password_token',
    PRIVATE_FIELDS: ['passwordHash', 'signupToken', 'resetPasswordToken'],
  },
};
