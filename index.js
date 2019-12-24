/* eslint-disable no-process-exit */
'use strict'

const Audit = require('./src/Audit')
const SeverityReporter = require('./src/Reporters/SeverityReporter')
const RemediationTypeReporter = require('./src/Reporters/RemediationTypeReporter')
const DependencyTypeReporter = require('./src/Reporters/DependencyTypeReporter')

const EXIT_CODE_ERROR = 2
const EXIT_CODE_VULNS = 1
const reportsList = [SeverityReporter, DependencyTypeReporter, RemediationTypeReporter]

async function main() {
  let vulnerabilitiesResult
  const audit = new Audit()
  try {
    vulnerabilitiesResult = await audit.test()
  } catch (error) {
    printError(error)
  }

  console.log()
  reportsList.forEach(Reporter => {
    const reporter = new Reporter({
      data: vulnerabilitiesResult
    })

    const stdoutText = reporter.getResult()
    console.log(reporter.getTitle())
    console.log(stdoutText)
    console.log()
  })

  if (
    vulnerabilitiesResult &&
    vulnerabilitiesResult.vulnerabilities &&
    vulnerabilitiesResult.vulnerabilities.length > 0
  ) {
    process.exit(EXIT_CODE_VULNS)
  }
}

function printError(error) {
  const githubIssueURL = 'https://github.com/lirantal/pie-my-vulns/issues'

  console.error()
  console.error(`Unexpected failure: ${error.message}`)
  console.error(`To enable debug information invoke the CLI with a DEBUG=pie* prefix.`)
  console.error()
  console.error(`Please open an issue at: ${githubIssueURL}`)

  process.exit(EXIT_CODE_ERROR)
}

main().catch(error => {
  printError(error)
})
