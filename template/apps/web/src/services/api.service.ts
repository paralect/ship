// eslint-disable-next-line max-classes-per-file
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import config from 'config';

export class ApiError extends Error {
  __proto__: ApiError;

  data: any;

  status: number;

  constructor(data: any, status = 500, statusText = 'Internal Server Error') {
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
const throwApiError = ({
  status,
  statusText,
  data,
}: any) => {
  console.error(`API Error: ${status} ${statusText}`, data); //eslint-disable-line
  throw new ApiError(data, status, statusText);
};

class ApiClient {
  _api: AxiosInstance;

  _handlers: Map<string, any>;

  constructor(axiosConfig: AxiosRequestConfig) {
    this._handlers = new Map();

    this._api = axios.create(axiosConfig);
    this._api.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error) => {
        if (axios.isCancel(error)) {
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
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
        errorHandlers.forEach((handler: any) => {
          handler(errorResponse);
        });

        return throwApiError(errorResponse);
      },
    );
  }

  get(url: string, params: any = {}, requestConfig: AxiosRequestConfig<any> = {}): Promise<any> {
    return this._api({
      method: 'get',
      url,
      params,
      ...requestConfig,
    });
  }

  post(url: string, data: any = {}, requestConfig: AxiosRequestConfig<any> = {}): Promise<any> {
    return this._api({
      method: 'post',
      url,
      data,
      ...requestConfig,
    });
  }

  put(url: string, data: any = {}, requestConfig: AxiosRequestConfig<any> = {}): Promise<any> {
    return this._api({
      method: 'put',
      url,
      data,
      ...requestConfig,
    });
  }

  delete(url: string, data: any = {}, requestConfig: AxiosRequestConfig<any> = {}): Promise<any> {
    return this._api({
      method: 'delete',
      url,
      data,
      ...requestConfig,
    });
  }

  on(event: string, handler: (...args: any[]) => void) {
    if (this._handlers.has(event)) {
      this._handlers.get(event).add(handler);
    } else {
      this._handlers.set(event, new Set([handler]));
    }

    return () => this._handlers.get(event).remove(handler);
  }
}

export default new ApiClient({
  baseURL: config.API_URL,
  withCredentials: true,
  responseType: 'json',
});
