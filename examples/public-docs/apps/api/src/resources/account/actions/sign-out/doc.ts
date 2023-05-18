import { resourceName } from 'resources/account/constants';
import { RouteExtendedConfig } from 'services/docs.service';
import { EmptySchema } from 'schemas/empty.schema';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'post',
  path: `/${resourceName}/sign-out`,
  summary: 'Sign out',
  request: {},
  responses: {
    200: {
      description: 'Removed all auth metadata.',
      content: {
        'application/json': {
          schema: EmptySchema,
        },
      },
    },
  },
};

export default config;
