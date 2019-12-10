'use strict'

const Audit = require('./src/Audit')
const SeverityReporter = require('./src/Reporters/SeverityReporter')

async function main() {
  // instantiate a new audit session
  const audit = new Audit()
  const vulnerabilitiesResult = await audit.test()

  // report severity stats
  printVulnsSeverity(vulnerabilitiesResult)
}

function printVulnsSeverity(vulnerabilitiesResult) {
  const severityReporter = new SeverityReporter({
    data: vulnerabilitiesResult
  })
  const stdoutText = severityReporter.getResult()
  console.log(stdoutText)
}

main()
