// @flow

import { apiClient } from 'helpers/api';
import type { UserType } from './user.types';

export const fetchUser = (id: string = ''): Promise => {
  return apiClient.get(`/users/${id}`);
};

export const updateUser = (id: string = '', data: UserType = {}): Promise => {
  return apiClient.put(`/users/${id}`, data);
};
