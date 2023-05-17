import { resourceName } from 'resources/account/constants';
import { RouteExtendedConfig } from 'services/docs.service';
import { UserPublicSchema } from 'resources/user/schemas/userPublic.schema';

import { schema } from './schema';

const config: RouteExtendedConfig = {
  private: true,
  tags: [resourceName],
  method: 'put',
  path: `/${resourceName}/`,
  summary: 'Update user profile',
  request: {
    body: { content: { 'application/json': { schema } } },
  },
  responses: {
    200: {
      description: 'User account data',
      content: {
        'application/json': {
          schema: UserPublicSchema,
        },
      },
    },
  },
};

export default config;
