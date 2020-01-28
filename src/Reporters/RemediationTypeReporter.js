'use strict'

const Pie = require('cli-pie')
const RemediationTypeParser = require('../Parsers/RemediationTypeParser')
const DEFAULT_PIE_SIZE = 2

class RemediationTypeReporter {
  constructor({ data, pieSize, colorFul }) {
    this.options = {
      pieSize: pieSize || DEFAULT_PIE_SIZE,
      colorFul: !!colorFul
    }
    this.data = data
  }

  getTitle() {
    return `Vulnerabilities by remediation action:`
  }

  getResult() {
    const vulnSeverityParser = new RemediationTypeParser(this.data)
    vulnSeverityParser.parse()

    var pieChart = new Pie(
      this.options.pieSize,
      [
        {
          label: 'Upgradable vulnerabilities',
          value: vulnSeverityParser.getUpgradableCount(),
          color: [0, 255, 0]
        },
        {
          label: 'Patchable vulnerabilities',
          value: vulnSeverityParser.getPatchableCount(),
          color: [0, 0, 255]
        },
        {
          label: 'No remediation available',
          value: vulnSeverityParser.getNoRemediationCount(),
          color: [255, 0, 50]
        }
      ],
      {
        legend: true,
        flat: true,
        no_ansi: !this.options.colorFul
      }
    )

    return pieChart.toString()
  }
}

module.exports = RemediationTypeReporter
