const Reporter = require('../../src/Reporters/DependencyTypeReporter')
const data = require('../__fixtures__/output.json')

describe('Reporters', () => {
  describe('DependencyType reporter', () => {
    test('correctly returns a title', () => {
      const reporter = new Reporter({
        data
      })

      expect(reporter.getTitle()).toBe('Vulnerabilities by dependency source:')
    })

    test('constructor correctly sets data', () => {
      const reporter = new Reporter({
        data,
        pieSize: 1,
        colorFul: false
      })

      expect(reporter.options.pieSize).toBe(1)
      expect(reporter.options.colorFul).toBe(false)
    })

    test('returns a piechart string', () => {
      const reporter = new Reporter({
        data
      })

      const expectedProdDepsString = /Production Dependencies \(14\.75%\)/
      const expectedDevDepsString = /Development Dependencies \(85\.25%\)/

      const pieChartString = reporter.getResult()
      expect(pieChartString).toMatch(expectedProdDepsString)
      expect(pieChartString).toMatch(expectedDevDepsString)
    })
  })
})
