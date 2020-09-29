#!/usr/bin/env node
/* eslint-disable no-process-exit */
'use strict'
const parseArgs = require('minimist')
const fs = require('fs')
const debug = require('debug')('pie-my-vulns')
const Audit = require('../src/Audit')
const SeverityReporter = require('../src/Reporters/SeverityReporter')
const RemediationTypeReporter = require('../src/Reporters/RemediationTypeReporter')
const DependencyTypeReporter = require('../src/Reporters/DependencyTypeReporter')

const EXIT_CODE_ERROR = 1
const EXIT_CODE_VULNS = 2
const EXIT_CODE_VULNS_NONE = 0
const STDIN_FILE_DESCRIPTOR = 0
const reportsList = [SeverityReporter, DependencyTypeReporter, RemediationTypeReporter]

async function main() {
  let vulnerabilitiesResult = ''

  try {
    // Let's check if there's any input being piped from stdin
    if (fs.fstatSync(STDIN_FILE_DESCRIPTOR).isFIFO()) {
      vulnerabilitiesResult = await readFromStdin()
    } else {
      const argv = parseArgs(process.argv.slice(2))
      const { directory } = argv
      const audit = new Audit()
      vulnerabilitiesResult = await audit.test({ directory })
    }
  } catch (error) {
    printError(error)
  }

  console.log()

  if (!isVulnerabilitiesDetected(vulnerabilitiesResult)) {
    console.log('0 vulnerabilities found')
    process.exit(EXIT_CODE_VULNS_NONE)
  }

  reportsList.forEach(Reporter => {
    const reporter = new Reporter({
      data: vulnerabilitiesResult,
      colorFul: true
    })

    const stdoutText = reporter.getResult()
    if (stdoutText !== false) {
      console.log(reporter.getTitle())
      console.log(stdoutText)
      console.log()
    }
  })

  console.log('Summary:')
  console.log(
    `  - [${vulnerabilitiesResult.vulnerabilities.length}] Total number of vulnerabilities found`
  )
  console.log(
    `  - [${vulnerabilitiesResult.dependencyCount}] Total number of dependencies scanned\n`
  )

  process.exit(EXIT_CODE_VULNS)
}

async function readFromStdin() {
  return new Promise(resolve => {
    let data = ''
    const stdin = process.stdin
    stdin.on('readable', function() {
      const chunk = this.read()
      if (chunk !== null) {
        data += chunk
      }
    })
    stdin.on('end', function() {
      return resolve(JSON.parse(data))
    })
  })
}

function printError(error) {
  const githubIssueURL = 'https://github.com/lirantal/pie-my-vulns/issues'

  debug(error)
  console.error()
  console.error(`Unexpected failure: ${error.message}`)
  console.error()
  console.error(`To enable debug information invoke the CLI with a DEBUG=pie* prefix.`)
  console.error()
  console.error(`Please open an issue at: ${githubIssueURL}`)

  process.exit(EXIT_CODE_ERROR)
}

function isVulnerabilitiesDetected(vulnsData) {
  return vulnsData && vulnsData.vulnerabilities && vulnsData.vulnerabilities.length > 0
}

main().catch(error => {
  printError(error)
})
