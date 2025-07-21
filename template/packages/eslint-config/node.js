import antfu from '@antfu/eslint-config';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/** @type {import("eslint").Linter.Config[]} */
export default antfu(
  {
    lessOpinionated: true,
  },
  {
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'ts/no-explicit-any': 'error',
      'ts/consistent-type-imports': 'off',

      'style/operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
      'style/quotes': ['error', 'single', { avoidEscape: true }],
      'style/brace-style': ['error', '1tbs'],
      'style/member-delimiter-style': 'off',
      'style/arrow-parens': ['error', 'always'],
      'style/semi': ['error', 'always'],
      curly: 'off',

      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
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
      'no-relative-import-paths/no-relative-import-paths': [
        'warn',
        {
          allowSameFolder: true,
          allowedDepth: 1,
          rootDir: './src',
          prefix: '',
        },
      ],

      'unused-imports/no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
        },
      ],

      'perfectionist/sort-imports': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Allows requiring modules relative to /src folder
            ['^module-alias'],
            // App environment variables
            ['^\\dotenv/config'],
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
            // Side effect imports.
            ['^\\u0000'],
          ],
        },
      ],
    },
  },
  {
    files: ['**/types.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
);
