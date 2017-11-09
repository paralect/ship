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
