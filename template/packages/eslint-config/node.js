import antfu from '@antfu/eslint-config';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export const getNodeConfig = (antfuOptions) =>
  antfu(
    {
      lessOpinionated: true,
      stylistic: false,
      ...antfuOptions,
    },
    {
      rules: {
        'ts/no-explicit-any': 'error',
        'ts/consistent-type-imports': 'off',

        curly: 'off',

        'no-console': [
          'error',
          {
            allow: ['warn', 'error'],
          },
        ],

        'unused-imports/no-unused-vars': [
          'error',
          {
            caughtErrors: 'none',
            varsIgnorePattern: '^_',
          },
        ],
      },
    },
    {
      plugins: {
        'simple-import-sort': simpleImportSort,
      },
      rules: {
        'perfectionist/sort-imports': 'off',
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Side effect imports.
              ['^\\u0000'],
              // Third-party libraries and frameworks
              ['^@?\\w'],
              // Particular business entities
              ['^resources'],
              // Internal app modules
              ['^middlewares', '^services', '^utils', '^routes'],
              // Internal sub apps
              ['^migrator', '^scheduler'],
              // App config file
              ['^config'],
              // App core modules
              ['^db', '^io-emitter', '^redis-client'],
              // Logger instance
              ['^logger'],
              // Internal packages
              ['^app-constants', '^schemas', '^types'],
              // Relative imports
              ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // Style imports.
              ['^.+\\.?(css|scss|sass)$'],
            ],
          },
        ],
      },
    },
    {
      plugins: {
        'no-relative-import-paths': noRelativeImportPaths,
      },
      rules: {
        'no-relative-import-paths/no-relative-import-paths': [
          'warn',
          {
            allowSameFolder: true,
            allowedDepth: 1,
            rootDir: './src',
            prefix: '',
          },
        ],
      },
    },
    // Disallow importing from 'app-types' as it's a special module for reexporting types
    {
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['app-types'],
                message: 'Please use import from "types" module instead.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['**/types.ts'],
      rules: {
        'no-restricted-imports': 'off', // disable rule for reexporting types from 'app-types'
      },
    },
  );

export default getNodeConfig();
