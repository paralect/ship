import type { JestConfigWithTsJest } from 'ts-jest';
// import { defaults as tsjPreset } from 'ts-jest/presets';
// const { defaults: tsjPreset } = require('ts-jest/presets');

import { pathsToModuleNameMapper } from 'ts-jest';

// const { compilerOptions } = require('./tsconfig.json');

const config: JestConfigWithTsJest = {
  preset: '@shelf/jest-mongodb',
  // preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  testMatch: [
    '**/?(*.)+(spec).+(ts)',
  ],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  resetMocks: true,
  clearMocks: true,
  watchPathIgnorePatterns: ['globalConfig'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
  // 'moduleNameMapper': {
  //   '(.*)': '<rootDir>/src/$1',
  // },
  roots: ['<rootDir>'],
  modulePaths: ['src'], // <-- This will be set to 'baseUrl' value
  // moduleNameMapper: pathsToModuleNameMapper({ '*': ['*'] }),
  moduleDirectories: ['node_modules'],
  testTimeout: 30000,
};

export default config;
