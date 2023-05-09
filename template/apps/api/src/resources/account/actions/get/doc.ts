import { resourceName } from '../../constants';
import { RouteExtendedConfig } from 'services/docs.service';
import { GetAccountSchema } from '../../schemas/getAccount.schema';

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