module.exports = {
  extends: ['next/core-web-vitals', 'plugin:react/recommended', './node.js'],
  env: {
    browser: true,
    node: true,
  },
  settings: {
    react: {
      version: '18.3',
    },
  },
  rules: {
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react-hooks/exhaustive-deps': 'off',

    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.tsx'],
      },
    ],

    'react-hooks/rules-of-hooks': 'error',

    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
      },
    ],
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
  ],
};
