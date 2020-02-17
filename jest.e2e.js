const jestConfig = require('./jest.default')
jestConfig.testMatch = ['**/__e2e__/*.e2e.js']
jestConfig.collectCoverage = false
jestConfig.coverageThreshold = null
jestConfig.testTimeout = 30000
module.exports = jestConfig
