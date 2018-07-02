// @flow

import { apiClient } from 'helpers/api';

import type { StateType } from './user.types';

export const fetchUser = (id: string = ''): Promise<StateType> => {
  return apiClient.get(`/users/${id}`);
};

export const updateUser = (id: string = '', data: StateType): Promise<*> => {
  return apiClient.put(`/users/${id}`, data);
};
