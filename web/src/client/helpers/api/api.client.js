import axios from 'axios';
import ApiError from './api.error';

// Do not throw errors on 'bad' server response codes
axios.interceptors.response.use(axiosConfig => axiosConfig, error => error.response);

const generalError = { general: ['Unexpected Error Occurred'] };

const throwApiError = ({ data, status }) => {
  console.error('API: Error Ocurred', status, data); //eslint-disable-line
  throw new ApiError(data, status);
};

const httpRequest = method => async (url, data) => {
  const options = {
    headers: { Authorization: `Bearer ${window.token}` },
    method,
  };

  if (data) {
    if (method === 'get') {
      options.params = data;
    } else {
      options.data = data;
    }
  }

  let urlWithSlash = url;

  if (urlWithSlash[0] !== '/') {
    urlWithSlash = `/${urlWithSlash}`;
  }

  options.url = `${window.config.apiUrl}${urlWithSlash}`;

  const response = await axios(options);

  if (response.status >= 200 && response.status < 300) {
    return response.data || {};
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
  get: getRequest,
  post: postRequest,
  put: putRequest,
  delete: deleteRequest,
};

export default apiClient;
