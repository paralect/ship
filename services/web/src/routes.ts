export const scope = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  NONE: '',
};

export const layout = {
  MAIN: 'main',
  UNAUTHORIZED: 'unauthorized',
  NONE: '',
};

export const path = {
  home: '/',
  404: '/404',
  signIn: '/sign-in',
  signUp: '/sign-up',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  expireToken: '/expire-token',
  profile: '/profile',
};

type RoutesConfiguration = {
  [key: string]: {
    path: string;
    layout?: string;
    scope?: string;
  };
};

export const configuration: RoutesConfiguration = {
  home: {
    path: path.home,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
  404: {
    path: path['404'],
    scope: scope.NONE,
    layout: layout.UNAUTHORIZED,
  },
  signIn: {
    path: path.signIn,
    scope: scope.PUBLIC,
    layout: layout.UNAUTHORIZED,
  },
  signUp: {
    path: path.signUp,
    scope: scope.PUBLIC,
    layout: layout.UNAUTHORIZED,
  },
  forgotPassword: {
    path: path.forgotPassword,
    scope: scope.PUBLIC,
    layout: layout.UNAUTHORIZED,
  },
  resetPassword: {
    path: path.resetPassword,
    scope: scope.PUBLIC,
    layout: layout.UNAUTHORIZED,
  },
  expireToken: {
    path: path.expireToken,
    scope: scope.PUBLIC,
    layout: layout.UNAUTHORIZED,
  },
  profile: {
    path: path.profile,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
};
