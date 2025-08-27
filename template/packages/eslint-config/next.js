import { renameRules } from '@antfu/eslint-config';
import reactPlugin from 'eslint-plugin-react';

import { getNodeConfig } from './node.js';

export default getNodeConfig({
  react: true,
  nextjs: true,
}).append(
  {
    rules: {
      'react-hooks/exhaustive-deps': 'off', // Disable automatic dependency tracking to allow manual control

      'unicorn/prefer-node-protocol': 'off', // Next.js doesn't support "node:" URI
    },
  },
  {
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Third-party libraries and frameworks
            ['^react$', '^next', '^@mantine/core$', '^@mantine/', '^@?\\w'],
            // Particular business entities
            ['^resources'],
            // Shared components under the web application
            ['^components'],
            // Static files
            ['^public'],
            // Internal app modules
            ['^contexts', '^services', '^theme', '^utils'],
            // Other app modules
            [
              '^routes', // App pages structure
              '^query-client', // React Query Client
              '^config', // App config with env variables
            ],
            // Internal packages
            ['^app-constants', '^schemas', '^types'],
            // Relative imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports.
            ['^.+\\.?(css|scss|sass)$'],
            // Side effect imports.
            ['^\\u0000'],
          ],
        },
      ],
    },
  },
  {
    plugins: {
      'jsx-react': reactPlugin,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: renameRules(
      {
        ...reactPlugin.configs.flat.recommended.rules,

        'react/react-in-jsx-scope': 'off',
        'react/jsx-boolean-value': ['error', 'never'],
        'react/function-component-definition': [
          'error',
          {
            namedComponents: 'arrow-function',
          },
        ],
      },
      {
        react: 'jsx-react',
      },
    ),
  },
);
