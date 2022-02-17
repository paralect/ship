// eslint-disable-next-line max-classes-per-file
import axios from 'axios';
import qs from 'qs';

import { environment } from 'config';

class ApiError extends Error {
  constructor(data, status = 500, statusText = 'Internal Server Error') {
    super(`${status} ${statusText}`);

    this.constructor = ApiError;
    this.__proto__ = ApiError.prototype; // eslint-disable-line no-proto

    this.name = this.constructor.name;
    this.data = data;
    this.status = status;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  inspect() {
    return this.stack;
  }
}
const throwApiError = ({ status, statusText, data }) => {
  console.error(`API Error: ${status} ${statusText}`, data); //eslint-disable-line
  throw new ApiError(data, status, statusText);
};

class ApiClient {
  constructor(axiosConfig) {
    this._handlers = new Map();

    this._api = axios.create(axiosConfig);
    this._api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (axios.isCancel(error)) {
          throw error;
        }
        // Axios Network Error & Timeout error dont have 'response' field
        // https://github.com/axios/axios/issues/383
        const errorResponse = error.response || {
          status: error.code,
          statusText: error.message,
          data: error.data,
        };

        const errorHandlers = this._handlers.get('error') || [];
        errorHandlers.forEach((handler) => {
          handler(errorResponse);
        });

        return throwApiError(errorResponse);
      },
    );
  }

  get(url, params = {}, requestConfig = {}) {
    return this._api({
      method: 'get',
      url,
      params,
      ...requestConfig,
    });
  }

  post(url, data = {}, requestConfig = {}) {
    return this._api({
      method: 'post',
      url,
      data,
      ...requestConfig,
    });
  }

  put(url, data = {}, requestConfig = {}) {
    return this._api({
      method: 'put',
      url,
      data,
      ...requestConfig,
    });
  }

  delete(url, data = {}, requestConfig = {}) {
    return this._api({
      method: 'delete',
      url,
      data,
      ...requestConfig,
    });
  }

  on(event, handler) {
    if (this._handlers.has(event)) {
      this._handlers.get(event).add(handler);
    } else {
      this._handlers.set(event, new Set([handler]));
    }

    return () => this._handlers.get(event).remove(handler);
  }
}

export default new ApiClient({
  baseURL: environment.apiUrl,
  withCredentials: true,
  responseType: 'json',
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
});
