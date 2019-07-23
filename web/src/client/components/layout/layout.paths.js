export const indexPath = (options = {}) => ({
  ...options,
  pathname: '/',
});

export const profilePath = (options = {}) => ({
  ...options,
  pathname: '/profile',
});

export const changePasswordPath = (options = {}) => ({
  ...options,
  pathname: '/change-password',
});

export const logoutPath = (options = {}) => ({
  ...options,
  pathname: '/logout',
});

export const reportsPath = (options = {}) => ({
  ...options,
  pathname: '/reports',
});
