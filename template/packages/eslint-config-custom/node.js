module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'airbnb', 'airbnb-typescript', 'prettier'],
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort', 'no-relative-import-paths'],
  ignorePatterns: ['.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 14,
    sourceType: 'module',
  },
  env: {
    node: true,
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
            message: "Please use import from 'types' module instead.",
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
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

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
  },
  overrides: [
    {
      files: ['*.js', '*.ts'],
      rules: {
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
  ],
};
