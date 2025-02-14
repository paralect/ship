export enum ScopeType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum LayoutType {
  MAIN = 'MAIN',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export enum RoutePath {
  // Private paths
  Home = '/',
  Profile = '/profile',

  // Auth paths
  SignIn = '/sign-in',
  SignUp = '/sign-up',
  ForgotPassword = '/forgot-password',
  ResetPassword = '/reset-password',
  ExpireToken = '/expire-token',

  NotFound = '/404',
}

type RoutesConfiguration = {
  [routePath in RoutePath]: {
    scope?: ScopeType;
    layout?: LayoutType;
  };
};

export const routesConfiguration: RoutesConfiguration = {
  // Private routes
  [RoutePath.Home]: {
    scope: ScopeType.PRIVATE,
    layout: LayoutType.MAIN,
  },
  [RoutePath.Profile]: {
    scope: ScopeType.PRIVATE,
    layout: LayoutType.MAIN,
  },

  // Auth routes
  [RoutePath.SignIn]: {
    scope: ScopeType.PUBLIC,
    layout: LayoutType.UNAUTHORIZED,
  },
  [RoutePath.SignUp]: {
    scope: ScopeType.PUBLIC,
    layout: LayoutType.UNAUTHORIZED,
  },
  [RoutePath.ForgotPassword]: {
    scope: ScopeType.PUBLIC,
    layout: LayoutType.UNAUTHORIZED,
  },
  [RoutePath.ResetPassword]: {
    scope: ScopeType.PUBLIC,
    layout: LayoutType.UNAUTHORIZED,
  },
  [RoutePath.ExpireToken]: {
    scope: ScopeType.PUBLIC,
    layout: LayoutType.UNAUTHORIZED,
  },

  [RoutePath.NotFound]: {},
};
