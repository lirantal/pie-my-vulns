#!/usr/bin/env node
/* eslint-disable no-process-exit */
'use strict'

const Audit = require('../src/Audit')
const SeverityReporter = require('../src/Reporters/SeverityReporter')
const RemediationTypeReporter = require('../src/Reporters/RemediationTypeReporter')
const DependencyTypeReporter = require('../src/Reporters/DependencyTypeReporter')

const EXIT_CODE_ERROR = 1
const EXIT_CODE_VULNS = 2
const EXIT_CODE_VULNS_NONE = 0
const reportsList = [SeverityReporter, DependencyTypeReporter, RemediationTypeReporter]

async function main() {
  let vulnerabilitiesResult
  let args = process.argv.slice(2);
  if (args.length > 0){
    try {
        vulnerabilitiesResult = await JSON.parse(args[0])
    } catch (error) {
        printError(error)
    }
  } else {
    const audit = new Audit()
    try {
        vulnerabilitiesResult = await audit.test()
    } catch (error) {
        printError(error)
    }
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

  process.exit(EXIT_CODE_VULNS)
}

function printError(error) {
  const githubIssueURL = 'https://github.com/lirantal/pie-my-vulns/issues'

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
