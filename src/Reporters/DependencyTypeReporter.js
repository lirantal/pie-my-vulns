'use strict'

const Pie = require('cli-pie')
const DependencyTypeParser = require('../Parsers/DependencyTypeParser')
const DEFAULT_PIE_SIZE = 2

class DependencyTypeReporter {
  constructor({ data, pieSize, colorFul }) {
    this.options = {
      pieSize: pieSize || DEFAULT_PIE_SIZE,
      colorFul: colorFul || true
    }
    this.data = data
  }

  getResult() {
    const vulnSeverityParser = new DependencyTypeParser(this.data)
    vulnSeverityParser.parse()

    var pieChart = new Pie(
      this.options.pieSize,
      [
        {
          label: 'Upgradable Vulns',
          value: vulnSeverityParser.getUpgradableCount(),
          color: [0, 0, 255]
        },
        {
          label: 'Patchable Vulns',
          value: vulnSeverityParser.getPatchableCount(),
          color: [255, 0, 255]
        },
        {
          label: 'No Remediation',
          value: vulnSeverityParser.getNoRemediationCount(),
          color: [255, 255, 0]
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

module.exports = DependencyTypeReporter
