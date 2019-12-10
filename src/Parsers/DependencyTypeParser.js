'use strict'

class DependencyTypeParser {
  constructor(vulnsData) {
    this.vulnsData = vulnsData
    this.vulnsMap = {
      isPatchable: 0,
      isUpgradable: 0,
      none: 0
    }
  }

  parse() {
    if (!this.vulnsData.vulnerabilities) {
      return this.vulnsMap
    }

    this.vulnsData.vulnerabilities.map(vulnItem => {
      if (vulnItem.isUpgradable === true) {
        this.vulnsMap['isUpgradable'] += 1
        return true
      }

      if (vulnItem.isPatchable === true) {
        this.vulnsMap['isPatchable'] += 1
        return true
      }

      this.vulnsMap['none'] += 1
      return true
    })

    return this.vulnsMap
  }

  getUpgradableCount() {
    return this.vulnsMap['isUpgradable']
  }

  getPatchableCount() {
    return this.vulnsMap['isPatchable']
  }

  getNoRemediationCount() {
    return this.vulnsMap['none']
  }
}

module.exports = DependencyTypeParser
