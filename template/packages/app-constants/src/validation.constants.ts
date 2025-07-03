// Password validation regex explanation:
// ^                 - Start of string
// (?=.*[a-zA-Z])    - At least one letter (uppercase or lowercase)
// (?=.*\d)          - At least one digit
// $                 - End of string
//
// This regex ONLY checks for at least one letter and one digit.
// It does NOT enforce length, special characters, or whitespace rules.
// Use separate validation for length.
export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REGEX: /^(?=.*[a-zA-Z])(?=.*\d).*$/,
};
