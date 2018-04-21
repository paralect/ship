// @flow

import type { ErrorDataType } from './api.types';

class ApiError extends Error {
  data: ErrorDataType;
  status: number;

  constructor(data: ErrorDataType, status: number) {
    super(data);

    // a workaround to make `instanceof ApiError` work in ES5 with babel
    // $FlowFixMe
    this.constructor = ApiError;
    // $FlowFixMe
    this.__proto__ = ApiError.prototype; // eslint-disable-line

    this.data = data;
    this.status = status;
  }

  status: number
}

// $FlowFixMe
ApiError.prototype = Error.prototype;

export default ApiError;
