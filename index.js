'use strict'

const Audit = require('./src/Audit')
const SeverityReporter = require('./src/Reporters/SeverityReporter')
const DependencyTypeReporter = require('./src/Reporters/DependencyTypeReporter')

async function main() {
  // instantiate a new audit session
  const audit = new Audit()
  const vulnerabilitiesResult = await audit.test()

  // report severity stats
  console.log()
  printVulnsSeverity(vulnerabilitiesResult)
  printVulnsDependencyType(vulnerabilitiesResult)
}

function printVulnsSeverity(vulnerabilitiesResult) {
  const reporter = new SeverityReporter({
    data: vulnerabilitiesResult
  })
  const stdoutText = reporter.getResult()
  console.log(`Vulnerabilities by severity:`)
  console.log(stdoutText)
}

function printVulnsDependencyType(vulnerabilitiesResult) {
  const reporter = new DependencyTypeReporter({
    data: vulnerabilitiesResult
  })
  const stdoutText = reporter.getResult()
  console.log(`Vulnerabilities by remediation action:`)
  console.log(stdoutText)
}

main()
