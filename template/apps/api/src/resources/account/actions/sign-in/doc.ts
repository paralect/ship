import { resourceName } from 'resources/account/constants';
import { schema } from './schema';
import { RouteExtendedConfig } from 'services/docs.service';
import { UserPublicSchema } from '../../../user/schemas/userPublic.schema';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'post',
  path: `/${resourceName}/sign-in`,
  summary: 'Sign in',
  request: {
    body: { content: { 'application/json': { schema } } },
  },
  responses: {
    200: {
      description: 'Object with user data.',
      content: {
        'application/json': {
          schema: UserPublicSchema,
        },
      },
    },
  },
};

export default config;