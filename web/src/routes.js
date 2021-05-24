import { generatePath } from 'react-router-dom';

export const scope = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

export const layout = {
  AUTH: 'auth',
  MAIN: 'main',
  NONE: null,
};

const defaults = {
  url(options = {}) {
    return {
      ...options,
      pathname: generatePath(this.path, options.params),
    };
  },
};

export const routes = {
  signIn: {
    ...defaults,
    name: 'signIn',
    path: '/signin',
    exact: false,
    scope: scope.PUBLIC,
    layout: layout.AUTH,
  },
  signUp: {
    ...defaults,
    name: 'signUp',
    path: '/signup',
    exact: false,
    scope: scope.PUBLIC,
    layout: layout.AUTH,
  },
  forgot: {
    ...defaults,
    name: 'forgot',
    path: '/forgot',
    exact: false,
    scope: scope.PUBLIC,
    layout: layout.AUTH,
  },
  reset: {
    ...defaults,
    name: 'reset',
    path: '/reset',
    exact: false,
    scope: scope.PUBLIC,
    layout: layout.AUTH,
  },
  home: {
    ...defaults,
    name: 'home',
    path: '/',
    exact: true,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
  profile: {
    ...defaults,
    name: 'profile',
    path: '/profile',
    exact: false,
    private: true,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
  notFound: {
    ...defaults,
    name: 'notFound',
    path: '/404',
    scope: scope.PUBLIC,
    layout: layout.NONE,
  },
};
