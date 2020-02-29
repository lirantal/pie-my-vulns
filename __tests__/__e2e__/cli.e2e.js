/* eslint-disable security/detect-child-process */
const path = require('path')
const util = require('util')
const childProcess = require('child_process')
const spawnAsync = util.promisify(childProcess.execFile)
const exec = childProcess.execSync

const cliBinPath = path.join(__dirname, '../../bin/pie-my-vulns.js')

describe('End-to-End CLI', () => {
  beforeAll(() => {
    const cmdForToken = `npx snyk config set "api=$SNYK_TEST_TOKEN"`
    exec(cmdForToken)
  })

  test('CLI should return error code 2 when vulnerabilities are found', async () => {
    expect.assertions(1)

    try {
      await spawnAsync('node', [cliBinPath], {
        cwd: path.join(__dirname, 'project1')
      })
    } catch (err) {
      expect(err.code).toBe(2) // means that vulnerabilities were found
    }
  })

  test('CLI should show vulnerabilities breakdown numbers and their titles', async () => {
    expect.assertions(7)

    try {
      await spawnAsync('node', [cliBinPath], {
        cwd: path.join(__dirname, 'project1')
      })
    } catch (err) {
      expect(err.stdout).toContain('Medium severity (20.00%)')
      expect(err.stdout).toContain('High severity (0.00%)')
      expect(err.stdout).toContain('Low severity (80.00%)')
      expect(err.stdout).toContain('Patchable vulnerabilities (0.00%)')
      expect(err.stdout).toContain('No remediation available (0.00%)')

      expect(err.stdout).toContain('Vulnerabilities by severity:')
      expect(err.stdout).toContain('Vulnerabilities by remediation action:')
    }
  })

  test('CLI should return error code 1 when there is an issue', async () => {
    expect.assertions(2)

    try {
      await spawnAsync('node', [cliBinPath], {
        cwd: path.join(__dirname, 'project2')
      })
    } catch (err) {
      expect(err.code).toBe(1)
      expect(err.stderr).toContain('Unexpected failure: missing node_modules folders')
    }
  })

  test('CLI should return error code 0 when no vulnerabilities are found', async () => {
    const { stdout, err } = await spawnAsync('node', [cliBinPath], {
      cwd: path.join(__dirname, 'project3')
    })

    expect(err).toBe(undefined)
    expect(stdout).toContain('0 vulnerabilities found')
  })
})
