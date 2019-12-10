'use strict'

const Pie = require('cli-pie')
const VulnerabilitySeverityParser = require('../Parsers/SeverityParser')
const DEFAULT_PIE_SIZE = 2

class SeverityReporter {
  constructor({ data, pieSize, colorFul }) {
    this.options = {
      pieSize: pieSize || DEFAULT_PIE_SIZE,
      colorFul: colorFul || true
    }
    this.data = data
  }

  getResult() {
    const vulnSeverityParser = new VulnerabilitySeverityParser(this.data)
    vulnSeverityParser.parse()

    var pieChart = new Pie(
      this.options.pieSize,
      [
        {
          label: 'High severity',
          value: vulnSeverityParser.getHighSeverityCount(),
          color: [0, 0, 255]
        },
        {
          label: 'Medium severity',
          value: vulnSeverityParser.getMediumSeverityCount(),
          color: [255, 0, 255]
        },
        {
          label: 'Low severity',
          value: vulnSeverityParser.getLowSeverityCount(),
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

module.exports = SeverityReporter
