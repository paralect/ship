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
    'import/prefer-default-export': 'off',
    'object-curly-newline': 'off',
    'max-classes-per-file': 'off',
    'max-len': ['warn', {
      code: 120,
      ignoreStrings: true,
      ignoreUrls: true,
    }],
  },
};
