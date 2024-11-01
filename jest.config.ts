import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  
  // Add these important configurations
  testEnvironment: 'jest-environment-node',
  
  // Setup test matches
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  
  // Module name mapper for @ imports and other aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1'
  },
  
  // Setup files for test environment
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Important for Next.js
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/dist/'
  ],
  
  // Transform files
  // transform: {
  //   '^.+\\.(t|j)sx?$': '@swc/jest'
  // },
  
  // Coverage configuration
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
    '/coverage/',
    'jest.config.ts',
    'jest.setup.ts'
  ],
  
  coverageReporters: [
    "json",
    "text",
    "lcov",
    "clover"
  ],
  
  // Optional but recommended coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};

// Use createJestConfig to generate the final config
export default createJestConfig(config);
