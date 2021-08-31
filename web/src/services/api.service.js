import axios from 'axios';
import qs from 'qs';
import _merge from 'lodash/merge';

import config from 'config';

function throwApiError({ message, status, data = {} }) {
  const error = new Error();
  error.name = 'Request Error';
  error.message = message;
  error.status = status;
  error.data = data;

  // eslint-disable-next-line no-console
  console.error(error);

  throw error;
}

class ApiClient {
  constructor(axiosConfig) {
    this._handlers = new Map();

    this._api = axios.create(axiosConfig);
    this._api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const errorResponse = error.response || {
          message: error.message,
          status: error.code,
          data: error.data,
        };

        const errorHandlers = this._handlers.get('error') || [];
        errorHandlers.forEach((handler) => {
          handler(errorResponse);
        });

        throwApiError(errorResponse);
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

  postFile(url, file, requestConfig = {}) {
    const data = new FormData();
    data.append('file', file);
    _merge(requestConfig,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
  baseURL: config.apiUrl,
  withCredentials: true,
  responseType: 'json',
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
});
