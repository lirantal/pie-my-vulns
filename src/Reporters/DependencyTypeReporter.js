'use strict'

const Pie = require('cli-pie')
const DependencyTypeParser = require('../Parsers/DependencyTypeParser')
const DEFAULT_PIE_SIZE = 4

class DependencyTypeReporter {
  constructor({ data, pieSize, colorFul }) {
    this.options = {
      pieSize: pieSize || DEFAULT_PIE_SIZE,
      colorFul: !!colorFul
    }
    this.data = data
  }

  getTitle() {
    return `Vulnerabilities by dependency source:`
  }

  getResult() {
    const depTypeParser = new DependencyTypeParser(this.data)
    const res = depTypeParser.parse()
    if (res === false) {
      return false
    }

    var pieChart = new Pie(
      this.options.pieSize,
      [
        {
          label: 'Production Dependencies',
          value: depTypeParser.getProdDependencyCount(),
          color: [0, 255, 0]
        },
        {
          label: 'Development Dependencies',
          value: depTypeParser.getDevDependencyCount(),
          color: [0, 0, 255]
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
