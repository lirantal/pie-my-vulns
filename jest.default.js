module.exports = {
  testEnvironment: 'node',
  verbose: true,
  notify: true,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testPathIgnorePatterns: ['/__tests__/.*/__fixtures__/.*'],
  collectCoverageFrom: ['index.js', 'src/**/*.{js,ts}'],
  testMatch: ['**/*.test.js']
}
