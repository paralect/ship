const nodejsConfig = require('./node');

module.exports = {
  extends: ['next/core-web-vitals', 'plugin:react/recommended', './node.js'],
  env: {
    browser: true,
    node: true,
  },
  settings: { react: { version: 'detect' } },
  rules: {
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.tsx'],
      },
    ],

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
      },
    ],

    // @TODO fix all 'any' types in web app
    '@typescript-eslint/no-explicit-any': 'off',

    '@typescript-eslint/naming-convention': nodejsConfig.rules['@typescript-eslint/naming-convention'].map((rule) => {
      // for React components
      if (['variable', 'parameter', 'enumMember'].includes(rule.selector)) {
        rule.format.push('PascalCase');
      }

      return rule;
    }),
  },
  overrides: [
    // Allow require() syntax in .config.js files
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    // Config for simple-import-sort plugin
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
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
              ['^services', '^theme', '^utils'],
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
  ],
};
