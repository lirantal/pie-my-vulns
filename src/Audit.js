/* eslint-disable security/detect-child-process */
'use strict'

const Util = require('util')
const ChildProcess = require('child_process')
const ExecFile = Util.promisify(ChildProcess.execFile)

const auditCliCommand = 'node_modules/snyk/dist/cli/index.js'
const ERROR_VULNS_FOUND = 1
const ERROR_UNAUTHENTICATED = 2

class Audit {
  async authenticate() {
    return ExecFile(auditCliCommand, ['auth'])
  }

  async test() {
    let testResults = []

    try {
      await ExecFile(auditCliCommand, ['test', '--json'])
    } catch (error) {
      if (error.code === ERROR_VULNS_FOUND) {
        // we are authenticated as a user for Snyk
        // but vulnerabilities have been found
        testResults = JSON.parse(error.stdout)
      } else if (error.code === ERROR_UNAUTHENTICATED) {
        // user is not authenticated and and we need
        // to trigger the auth process
        await this.authenticate()
        return this.test()
      } else {
        throw error
      }
    }

    return testResults
  }
}

module.exports = Audit
