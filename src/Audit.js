/* eslint-disable security/detect-child-process */
'use strict'

const Util = require('util')
const ChildProcess = require('child_process')
const ExecFile = Util.promisify(ChildProcess.execFile)

const auditCliCommand = 'node_modules/snyk/dist/cli/index.js'

class Audit {
  async authenticate() {}

  async test() {
    let testResults = []

    try {
      await ExecFile(auditCliCommand, ['test', '--json'])
    } catch (error) {
      if (error.code === 1) {
        testResults = JSON.parse(error.stdout)
      }
    }

    return testResults
  }
}

module.exports = Audit
