import { resourceName } from 'resources/user/constants';
import { PaginatedUserPublicSchema } from 'resources/user/schemas/paginatedUserPublic.schema';
import { RouteExtendedConfig } from 'services/docs.service';

import { schema } from './schema';

const config: RouteExtendedConfig = {
  private: true,
  tags: [resourceName],
  method: 'get',
  path: `/${resourceName}/`,
  summary: 'List of users',
  request: {
    query: schema,
  },
  responses: {
    200: {
      description: 'List with users',
      content: {
        'application/json': {
          schema: PaginatedUserPublicSchema,
        },
      },
    },
  },
};

export default config;
