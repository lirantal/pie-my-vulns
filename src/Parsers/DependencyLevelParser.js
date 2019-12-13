'use strict'

class DependencyLevelParser {
  constructor(vulnsData) {
    this.vulnsData = vulnsData
    this.vulnsMap = {
      prodDependency: 0,
      devDependency: 0
    }
  }

  parse() {
    if (!this.vulnsData.vulnerabilities) {
      return this.vulnsMap
    }

    this.vulnsData.vulnerabilities.map(vulnItem => {
      if (vulnItem.parentDepType === 'prod') {
        this.vulnsMap.prodDependency += 1
      } else {
        this.vulnsMap.devDependency += 1
      }
    })
  }

  getProdDependencyCount() {
    return this.vulnsMap['prodDependency']
  }

  getDevDependencyCount() {
    return this.vulnsMap['devDependency']
  }
}

module.exports = DependencyLevelParser
