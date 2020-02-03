/* eslint-disable security/detect-object-injection */
const DepTypeReporter = require('../../src/Reporters/DependencyTypeReporter')
const RemediationTypeReporter = require('../../src/Reporters/RemediationTypeReporter')
const SevReporter = require('../../src/Reporters/SeverityReporter')

const reporterFunctions = [
  ['DepTypeReporter', DepTypeReporter],
  ['RemediationTypeReporter', RemediationTypeReporter],
  ['SevReporter', SevReporter]
]

const data = require('../__fixtures__/output.json')

describe('Reporters', () => {
  describe('Reporter instantiation', () => {
    test.each(reporterFunctions)(
      '%s: constructor correctly sets data',
      (reporterName, Reporter) => {
        const reporter = new Reporter({
          data,
          pieSize: 1,
          colorFul: false
        })

        expect(reporter.options.pieSize).toBe(1)
        expect(reporter.options.colorFul).toBe(false)
      }
    )
  })

  describe('Reporter titles', () => {
    const expectedReporterTitle = {
      DepTypeReporter: 'Vulnerabilities by dependency source:',
      RemediationTypeReporter: 'Vulnerabilities by remediation action:',
      SevReporter: 'Vulnerabilities by severity:'
    }

    test.each(reporterFunctions)('%s: correctly returns a title', (reporterName, Reporter) => {
      const reporter = new Reporter({
        data
      })

      expect(reporter.getTitle()).toBe(expectedReporterTitle[reporterName])
    })
  })

  describe('Reporter results', () => {
    const expectedStringInText = {
      DepTypeReporter: [
        /Production Dependencies \(14\.75%\)/,
        /Development Dependencies \(85\.25%\)/
      ],
      RemediationTypeReporter: [
        /Upgradable vulnerabilities \(53\.92%\)/,
        /Patchable vulnerabilities \(9\.22%\)/,
        /No remediation available \(36\.87%\)/
      ],
      SevReporter: [
        /High severity \(43\.32%\)/,
        /Medium severity \(41\.01%\)/,
        /Low severity \(15\.67%\)/
      ]
    }

    test.each(reporterFunctions)('%s: returns a piechart string', (reporterName, Reporter) => {
      const reporter = new Reporter({
        data
      })

      const pieChartString = reporter.getResult()

      expectedStringInText[reporterName].forEach(regexPattern => {
        expect(pieChartString).toMatch(regexPattern)
      })
    })
  })
})
