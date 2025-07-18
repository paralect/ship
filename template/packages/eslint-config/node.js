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
      // Too strict
      'no-param-reassign': 'off',
      'max-classes-per-file': 'off',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      // @TODO fix in /apps/api/src/migrator/migration-version/migration-version.service.ts
      'import/no-dynamic-require': 'off',
      'global-require': 'off',
      // https://stackoverflow.com/a/64024916/286387
      'no-use-before-define': 'off',
      // Allow for..of syntax
      'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
      // https://basarat.gitbook.io/typescript/main-1/defaultisbad
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'off',
      'import/no-anonymous-default-export': 'off',
      // It's not accurate in the monorepo style
      'import/no-extraneous-dependencies': 'off',
      'import/extensions': 'off',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      // Allow most functions to rely on type inference. If the function is exported, then `@typescript-eslint/explicit-module-boundary-types` will ensure it's typed.
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
          classes: true,
          variables: true,
          typedefs: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      // Enable some rules for async JS
      'no-promise-executor-return': 'error',
      'max-nested-callbacks': 'error',
      'no-return-await': 'error',

      'style/member-delimiter-style': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@stylistic/semi': ['error', 'always'],

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
);
