import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

type ApiErrorHandler = (error: ApiError) => void;

type EventHandler = ApiErrorHandler;

interface EventHandlers {
  error: ApiErrorHandler;
}

export class ApiError extends Error {
  data: unknown;
  status: number;

  constructor(
    data: unknown,
    status = 500,
    statusText = "Internal Server Error",
  ) {
    super(`${status} ${statusText}`);
    this.name = "ApiError";
    this.data = data;
    this.status = status;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  inspect() {
    return this.stack;
  }
}

export interface ApiClientConfig {
  baseURL: string;
  withCredentials?: boolean;
}

export class ApiClient {
  private _api: AxiosInstance;
  private _handlers: Map<keyof EventHandlers, Set<EventHandler>>;

  constructor(config: ApiClientConfig) {
    this._handlers = new Map<keyof EventHandlers, Set<EventHandler>>();
    this._api = axios.create({
      baseURL: config.baseURL,
      withCredentials: config.withCredentials ?? true,
      responseType: "json",
    });

    this._api.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error) => {
        const errorResponse = error.response || {
          status: error.code ? Number.parseInt(error.code, 10) : 500,
          statusText: error.message || "Network or timeout error",
          data: error.data,
        };

        const apiError = new ApiError(
          errorResponse.data,
          errorResponse.status,
          errorResponse.statusText,
        );

        const errorHandlers = this._handlers.get("error");
        errorHandlers?.forEach((handler) => handler(apiError));

        throw apiError;
      },
    );
  }

  on<T extends keyof EventHandlers>(event: T, handler: EventHandlers[T]): void {
    let handlers = this._handlers.get(event);
    if (!handlers) {
      handlers = new Set<EventHandler>();
      this._handlers.set(event, handlers);
    }
    handlers.add(handler as EventHandler);
  }

  off<T extends keyof EventHandlers>(
    event: T,
    handler: EventHandlers[T],
  ): void {
    const handlers = this._handlers.get(event);
    handlers?.delete(handler as EventHandler);
  }

  get<T, P = unknown>(
    url: string,
    params?: P,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this._api({ method: "get", url, params, ...config });
  }

  post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this._api({ method: "post", url, data, ...config });
  }

  put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this._api({ method: "put", url, data, ...config });
  }

  patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this._api({ method: "patch", url, data, ...config });
  }

  delete<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this._api({ method: "delete", url, data, ...config });
  }
}
