import axios from 'axios';
import getConfig from 'next/config';
import ApiError from './api.error';

const {
  publicRuntimeConfig: { apiUrl },
} = getConfig();

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  responseType: 'json',
});

// Do not throw errors on 'bad' server response codes
api.interceptors.response.use((axiosConfig) => axiosConfig, (error) => error.response);

const generalError = { general: ['Unexpected Error Occurred'] };

const throwApiError = ({ data, status }) => {
  console.error('API: Error Ocurred', status, data); // eslint-disable-line no-console
  throw new ApiError(data, status);
};

const httpRequest = (method) => async (url, data) => {
  let urlWithSlash = url;

  if (urlWithSlash[0] !== '/') {
    urlWithSlash = `/${urlWithSlash}`;
  }

  const options = {
    method,
    url: urlWithSlash,
  };

  if (data) {
    if (method === 'get') {
      options.params = data;
    } else {
      options.data = data;
    }
  }

  const response = await api(options);

  if (response.status >= 200 && response.status < 300) {
    return response.data || { };
  }

  if (response.status === 400) {
    throwApiError(response);
  }

  throwApiError({ errors: [generalError] });
  return null;
};

export const getRequest = httpRequest('get');
export const postRequest = httpRequest('post');
export const putRequest = httpRequest('put');
export const deleteRequest = httpRequest('delete');

const apiClient = {
  get: getRequest,
  post: postRequest,
  put: putRequest,
  delete: deleteRequest,
};

export default apiClient;
