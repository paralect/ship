import fs from 'node:fs';
import path from 'node:path';

import type { EndpointDefinition } from 'routes/types';

import { getResourcePath } from './get-resources.util';

export const getResourceEndpoints = async (resourceName: string): Promise<EndpointDefinition[]> => {
  const resourcePath = getResourcePath(resourceName);
  const endpointsPath = path.join(resourcePath, 'endpoints');

  if (!fs.existsSync(endpointsPath)) {
    return [];
  }

  const endpointFiles = fs.readdirSync(endpointsPath).filter((file) => file.endsWith('.ts') && !file.endsWith('.d.ts'));

  const endpoints: EndpointDefinition[] = [];

  for (const file of endpointFiles) {
    const filePath = path.join(endpointsPath, file);
    const module = await import(filePath);
    const def = module.default;

    if (def?.endpoint && def?.handler) {
      endpoints.push({
        endpoint: def.endpoint,
        handler: def.handler,
        schema: def.schema,
        middlewares: def.middlewares || [],
      });
    }
  }

  return endpoints;
};

export default getResourceEndpoints;
