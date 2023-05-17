import { resourceName } from 'resources/account/constants';
import { GetAccountSchema } from 'resources/account/schemas/getAccount.schema';
import { RouteExtendedConfig } from 'services/docs.service';

const config: RouteExtendedConfig = {
  private: true,
  tags: [resourceName],
  method: 'get',
  path: `/${resourceName}/`,
  summary: 'Get current user',
  request: {},
  responses: {
    200: {
      description: 'Account Data',
      content: {
        'application/json': {
          schema: GetAccountSchema,
        },
      },
    },
  },
};

export default config;
