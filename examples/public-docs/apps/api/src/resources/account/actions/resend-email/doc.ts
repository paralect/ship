import { resourceName } from 'resources/account/constants';
import { EmptySchema } from 'schemas/empty.schema';
import { RouteExtendedConfig } from 'services/docs.service';

import { schema } from './schema';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'post',
  path: `/${resourceName}/resend-email`,
  summary: 'Resend email',
  request: {
    body: { content: { 'application/json': { schema } } },
  },
  responses: {
    200: {
      description: 'Empty data',
      content: {
        'application/json': {
          schema: EmptySchema,
        },
      },
    },
  },
};

export default config;
