import { resourceName } from 'resources/account/constants';
import { schema } from './schema';
import { RouteExtendedConfig } from 'services/docs.service';
import { EmptySchema } from 'schemas/empty.schema';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'post',
  path: `/${resourceName}/forgot-password`,
  summary: 'Forgot password',
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