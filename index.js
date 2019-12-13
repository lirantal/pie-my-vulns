'use strict'

const Audit = require('./src/Audit')
const SeverityReporter = require('./src/Reporters/SeverityReporter')
const RemediationTypeReporter = require('./src/Reporters/RemediationTypeReporter')
const DependencyTypeReporter = require('./src/Reporters/DependencyTypeReporter')

const reportsList = [SeverityReporter, DependencyTypeReporter, RemediationTypeReporter]

async function main() {
  // instantiate a new audit session
  const audit = new Audit()
  const vulnerabilitiesResult = await audit.test()

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
}

main()
