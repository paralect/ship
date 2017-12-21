// @flow

export type ValidationErrorsType = {
  [key: string]: string | Array<string> | ValidationErrorsType,
};

export type ValidationResultType = {
  value: Object, // eslint-disable-line
  errors: ValidationErrorsType,
};

export type ValidationResultErrorsType = {
  errors: ValidationErrorsType,
  isValid: boolean,
};
