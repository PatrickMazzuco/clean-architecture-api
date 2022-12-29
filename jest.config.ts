export default {
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'json',
    'text',
    'lcov',
    'clover',
    'text-summary'
  ],
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
