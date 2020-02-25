'use strict'

const Pie = require('cli-pie')
const VulnerabilitySeverityParser = require('../Parsers/SeverityParser')
const DEFAULT_PIE_SIZE = 4

class SeverityReporter {
  constructor({ data, pieSize, colorFul }) {
    this.options = {
      pieSize: pieSize || DEFAULT_PIE_SIZE,
      colorFul: !!colorFul
    }
    this.data = data
  }

  getTitle() {
    return `Vulnerabilities by severity:`
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
          color: [255, 0, 255]
        },
        {
          label: 'Medium severity',
          value: vulnSeverityParser.getMediumSeverityCount(),
          color: [179, 26, 107]
        },
        {
          label: 'Low severity',
          value: vulnSeverityParser.getLowSeverityCount(),
          color: [89, 87, 117]
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
