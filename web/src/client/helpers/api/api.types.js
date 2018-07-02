// @flow

import ApiError from './api.error'; // eslint-disable-line

export type ErrorType = {
  [string]: Array<string>,
};

export type ErrorDataType = {
  errors: ErrorType,
};

export type ApiErrorType = ApiError;
