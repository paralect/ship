// @flow

import type { LocationShape } from 'react-router-dom';

export const indexPath = (options: LocationShape = {}): LocationShape => ({
  ...options,
  pathname: '/',
});

export const profilePath = (options: LocationShape = {}): LocationShape => ({
  ...options,
  pathname: '/profile',
});

export const changePasswordPath = (options: LocationShape = {}): LocationShape => ({
  ...options,
  pathname: '/change-password',
});

export const logoutPath = (options: LocationShape = {}): LocationShape => ({
  ...options,
  pathname: '/logout',
});

export const reportsPath = (options: LocationShape = {}): LocationShape => ({
  ...options,
  pathname: '/reports',
});
