class ApiError extends Error {
  constructor(data, status) {
    super(data);

    // a workaround to make `instanceof ApiError` work in ES5 with babel
    this.constructor = ApiError;
    this.__proto__ = ApiError.prototype; // eslint-disable-line

    this.data = data;
    this.status = status;
  }
}

ApiError.prototype = Error.prototype;

export default ApiError;
