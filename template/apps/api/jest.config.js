/** @type {import('jest').Config} */
const config = {
  preset: '@shelf/jest-mongodb',
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec.ts)'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  watchPathIgnorePatterns: ['globalConfig'],
  roots: ['<rootDir>'],
  modulePaths: ['src'],
  moduleDirectories: ['node_modules'],
  testTimeout: 10000,
};

module.exports = config;
