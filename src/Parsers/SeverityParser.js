'use strict'

class VulnerabilitySeverityParser {
  constructor(vulnsData) {
    this.vulnsData = vulnsData
    this.vulnsMap = {
      high: 0,
      medium: 0,
      low: 0
    }
  }

  parse() {
    if (!this.vulnsData.vulnerabilities) {
      return this.vulnsMap
    }

    this.vulnsData.vulnerabilities.map(vulnItem => {
      this.vulnsMap[vulnItem.severity] += 1
    })

    return this.vulnsMap
  }

  getHighSeverityCount() {
    return this.vulnsMap['high']
  }

  getMediumSeverityCount() {
    return this.vulnsMap['medium']
  }

  getLowSeverityCount() {
    return this.vulnsMap['low']
  }
}

module.exports = VulnerabilitySeverityParser
