import { resourceName } from 'resources/account/constants';
import { RouteExtendedConfig } from 'services/docs.service';
import { EmptySchema } from 'schemas/empty.schema';

import { schema } from './schema';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'post',
  path: `/${resourceName}/sign-up`,
  summary: 'Sign up',
  request: {
    body: { content: { 'application/json': { schema } } },
  },
  responses: {
    200: {
      description: 'Empty data.',
      content: {
        'application/json': {
          schema: EmptySchema,
        },
      },
    },
  },
};

export default config;
