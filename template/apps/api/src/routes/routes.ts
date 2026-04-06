import mount from 'koa-mount';

import isPublic from 'middlewares/isPublic';
import validateMiddleware from 'middlewares/validate';
import { getResourceEndpoints } from 'utils/get-resource-endpoints.util';
import { getResources } from 'utils/get-resources.util';

import logger from 'logger';

import type { AppKoa, AppRouter, AppRouterMiddleware } from 'types';

import auth from './middlewares/auth';
import type { EndpointDefinition } from './types';

const registerEndpoint = (router: AppRouter, resourceName: string, endpoint: EndpointDefinition): void => {
  const { method, path } = endpoint.endpoint;
  const middlewares: AppRouterMiddleware[] = [];

  // Check if isPublic middleware is present (comparing function references)
  const hasIsPublic = endpoint.middlewares?.some((m) => m === isPublic);
  if (!hasIsPublic) {
    middlewares.push(auth as AppRouterMiddleware);
  }

  if (endpoint.schema) {
    middlewares.push(validateMiddleware(endpoint.schema) as AppRouterMiddleware);
  }

  if (endpoint.middlewares?.length) {
    middlewares.push(...(endpoint.middlewares as AppRouterMiddleware[]));
  }

  middlewares.push(endpoint.handler as AppRouterMiddleware);

  const fullPath = path.startsWith('/') ? path : `/${path}`;
  router[method](fullPath, ...middlewares);

  const methodLabel = method.toUpperCase().padEnd(6);
  const routePath = `/${resourceName}${fullPath === '/' ? '' : fullPath}`;

  logger.info(`[routes] ${methodLabel} ${routePath}`);
};

export const registerRoutes = async (app: AppKoa, AppRouterClass: typeof AppRouter): Promise<void> => {
  const resources = getResources();

  for (const resourceName of resources) {
    const endpoints = await getResourceEndpoints(resourceName);

    if (endpoints.length === 0) continue;

    const router = new AppRouterClass();

    for (const endpoint of endpoints) {
      registerEndpoint(router, resourceName, endpoint);
    }

    app.use(mount(`/${resourceName}`, router.routes()));
    app.use(mount(`/${resourceName}`, router.allowedMethods()));
  }
};

export default registerRoutes;
