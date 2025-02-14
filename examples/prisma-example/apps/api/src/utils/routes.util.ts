import { AppRouter, AppRouterMiddleware } from 'types';

export type RegisterRouteFunc = (router: AppRouter) => void;

const getRoutes = (routeFunctions: RegisterRouteFunc[]): AppRouterMiddleware => {
  const router = new AppRouter();

  routeFunctions.forEach((func: RegisterRouteFunc) => {
    func(router);
  });

  return router.routes();
};

export default {
  getRoutes,
};
