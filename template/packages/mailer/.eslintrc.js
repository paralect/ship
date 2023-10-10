module.exports = {
  plugins: ['@typescript-eslint'],
  extends: ['airbnb', 'airbnb-typescript'],
  ignorePatterns: ['.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
    'object-curly-newline': 'off',
    'max-len': ['warn', {
      code: 120,
      ignoreStrings: true,
      ignoreUrls: true,
    }],
  },
};
