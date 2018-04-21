// @flow

import ApiError from './api.error';

export type ErrorType = {
  [string]: Array<string>,
};

export type ErrorDataType = {
  errors: ErrorType,
};

export type ApiErrorType = ApiError;
