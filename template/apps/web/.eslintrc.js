module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'next',
    'airbnb',
    'airbnb-typescript',
  ],
  ignorePatterns: ['.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    // solve problem with public folder
    'import/no-unresolved': [2,
      { ignore: ['public'] },
    ],
    'react/prop-types': 'off',
    'react/jsx-key': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
    'import/no-anonymous-default-export': 'off',
    'no-underscore-dangle': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/display-name': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unstable-nested-components': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'object-curly-newline': 'off',
    'no-restricted-imports': ['error', {
      name: 'lodash',
      message: 'Import individual methods from the Lodash module',
    }],
    'max-classes-per-file': 'off',
    'no-proto': 'off',
    'consistent-return': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@next/next/no-img-element': 'off',
    'react/function-component-definition': [2, {
      namedComponents: 'arrow-function',
    }],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx'],
        paths: [
          'src',
          'node_modules',
        ],
      },
    },
  },
};
