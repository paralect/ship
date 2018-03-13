// @flow

export type ValidationErrorsType = {
  [key: string]: any, // eslint-disable-line
};

export type ValidationResultType = {
  value: Object, // eslint-disable-line
  errors: ValidationErrorsType,
};

export type ValidationResultErrorsType = {
  errors: ValidationErrorsType,
  isValid: boolean,
};
