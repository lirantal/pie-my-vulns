/* eslint-disable security/detect-child-process */
'use strict'

const path = require('path')
const Util = require('util')
const ChildProcess = require('child_process')

const nodeCliCommand = 'node'
const auditCliCommand = path.join(__dirname, '../node_modules/snyk/dist/cli/index.js')
const auditCliArgs = [auditCliCommand, 'test', '--json']
const ERROR_VULNS_FOUND = 1
const ERROR_UNAUTHENTICATED = 2
const JSON_BUFFER_SIZE = 50 * 1024 * 1024

class Audit {
  async authenticate() {
    return new Promise((resolve, reject) => {
      const process = ChildProcess.execFile(nodeCliCommand, [auditCliCommand, 'auth'])
      process.stdout.on('data', chunk => {
        const httpsLinkMatch = chunk.match(/https:\/\/.*/g)
        if (httpsLinkMatch && httpsLinkMatch.length > 0) {
          const httpsLink = httpsLinkMatch[0].trim()
          console.log()
          console.log(`or you can hit this link:`)
          console.log(`  ${httpsLink}`)
        }
      })

      process.on('close', exitCode => {
        return resolve()
      })

      process.on('error', error => {
        return reject(new Error(error))
      })
    })
  }

  async test({ directory = '' } = {}) {
    const ExecFile = Util.promisify(ChildProcess.execFile)
    const args = [...auditCliArgs, ...(directory ? [directory] : [])]
    let testResults = []
    try {
      // allow for 50MB of buffer for a large JSON output
      await ExecFile(nodeCliCommand, args, {
        maxBuffer: JSON_BUFFER_SIZE
      })
    } catch (error) {
      const errorMessage = error.stdout

      // error: can't detect package manifest
      if (errorMessage && errorMessage.indexOf('Could not detect supported target files') !== -1) {
        throw new Error(`can't detect package manifest files\ntry running in the project's rootdir`)
      }

      if (errorMessage && errorMessage.indexOf("we can't test without dependencies") !== -1) {
        throw new Error(`missing node_modules folders\ninstall dependencies and try again`)
      }

      if (error.code === ERROR_VULNS_FOUND) {
        // we are authenticated as a user for Snyk
        // but vulnerabilities have been found
        testResults = JSON.parse(error.stdout)
      } else if (error.code === ERROR_UNAUTHENTICATED) {
        // user is not authenticated and we need
        // to trigger the auth process

        console.log(`Seems like you're not authenticated to Snyk,`)
        console.log(`so redirecting you now and after login I'll show scan results here`)
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
