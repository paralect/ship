import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: '@shelf/jest-mongodb',
  verbose: true,
  testEnvironment: 'node',
  testMatch: [
    '**/?(*.)+(spec.ts)',
  ],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  watchPathIgnorePatterns: ['globalConfig'],
  roots: ['<rootDir>'],
  modulePaths: ['src'],
  moduleDirectories: ['node_modules'],
  testTimeout: 10000,
};

export default config;
