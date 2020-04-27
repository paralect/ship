import { apiClient } from 'helpers/api';

export const fetchUser = (id = '') => {
  return apiClient.get(`/users/${id}`);
};

export const updateUser = (id = '', data) => {
  return apiClient.put(`/users/${id}`, data);
};

export const getTwoFaStatus = () => {
  return apiClient.get('/users/2fa/status');
};

export const initializeTwoFaSetup = () => {
  return apiClient.post('/users/2fa/init');
};

export const verifyTwoFaSetup = (data) => {
  return apiClient.post('/users/2fa/verify', data);
};

export const disableTwoFa = () => {
  return apiClient.post('/users/2fa/disable');
};
