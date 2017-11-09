import axios from 'axios';
import config from '~/config';
import ApiError from './api.error';

const { apiUrl } = config;

// Do not throw errors on 'bad' server response codes
axios.interceptors.response.use(axiosConfig => axiosConfig, error => error.response);

const generalError = { general: ['Unexpected Error Occurred'] };

const throwApiError = ({ data, status }) => {
  console.error('API: Error Ocurred', status, data); //eslint-disable-line
  throw new ApiError(data, status);
};

const httpRequest = method => async (url, data) => {
  let options = {};

  if (data) {
    if (method === 'get') {
      options.params = data;
    } else {
      options = data;
    }
  }

  let urlWithSlash = url;

  if (urlWithSlash[0] !== '/') {
    urlWithSlash = `/${urlWithSlash}`;
  }

  const response = await axios[method](`${apiUrl}${urlWithSlash}`, options);

  if (response.status >= 200 && response.status < 300) {
    return response.data || { };
  } else if (response.status === 400) {
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
  get: getRequest, post: postRequest, put: putRequest, delete: deleteRequest,
};

export default apiClient;
