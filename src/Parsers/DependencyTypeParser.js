/* eslint-disable no-prototype-builtins */
'use strict'

class DependencyTypeParser {
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

    const vulnItemScarce = this.vulnsData.vulnerabilities[0]
    if (vulnItemScarce.hasOwnProperty('parentDepType') !== true) {
      return false
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

module.exports = DependencyTypeParser
