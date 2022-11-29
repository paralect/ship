import type { JestConfigWithTsJest } from 'ts-jest';

import { pathsToModuleNameMapper } from 'ts-jest';

// const { compilerOptions } = require('./tsconfig.json');

const config: JestConfigWithTsJest = {
  // preset: '@shelf/jest-mongodb',
  // preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  testMatch: [
    '**/?(*.)+(spec).+(ts)',
  ],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  // 'moduleNameMapper': {
  //   '(.*)': '<rootDir>/src/$1',
  // },
  roots: ['<rootDir>'],
  modulePaths: ['src'], // <-- This will be set to 'baseUrl' value
  moduleNameMapper: pathsToModuleNameMapper({ '*': ['*'] }),
  moduleDirectories: ['node_modules', '.'],
};

export default config;
