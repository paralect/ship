import node from './node.js';
import next from '@next/eslint-plugin-next';
import jsxReact from 'eslint-plugin-react';

export default node({
  react: true,
}).append(
  {
    rules: {
      'react-hooks/exhaustive-deps': 'off', // much opinionated
      'style/jsx-one-expression-per-line': 'off', // conflicts with prettier
      'style/multiline-ternary': 'off', // conflicts with prettier

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
              '^config',
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
  // {
  //   plugins: {
  //     'jsx-react': jsxReact,
  //   },

  //   rules: {
  //     'jsx-react/function-component-definition': [
  //       'error',
  //       {
  //         namedComponents: 'arrow-function',
  //       },
  //     ],
  //   },
  // },
);
