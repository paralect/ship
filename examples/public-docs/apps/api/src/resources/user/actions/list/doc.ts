import { resourceName } from 'resources/user/constants';
import { schema } from './schema';
import { RouteExtendedConfig } from 'services/docs.service';
import { PaginatedUserPublicSchema } from '../../schemas/paginatedUserPublic.schema';

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