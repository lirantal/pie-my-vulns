/* eslint-disable security/detect-child-process */
const EventEmitter = require('events')
const { execFile } = require('child_process')
jest.mock('child_process')

const Audit = require('../src/Audit')

class ChildProcessStdoutMock extends EventEmitter {}
class ChildProcessSuccessMock extends EventEmitter {
  constructor() {
    super()
    this.self = this
  }

  get stdout() {
    const stdout = new ChildProcessStdoutMock()

    setImmediate(() => {
      stdout.emit(
        'data',
        `
      Now redirecting you to our auth page, go ahead and log in,
and once the auth is complete, return to this prompt and you'll
be ready to start using snyk.

If you can't wait use this url:
https://snyk.io/login?token=98723-28763-28g830-f2iu873b
      `
      )
    }, 0)

    setImmediate(() => {
      this.self.emit('close')
    }, 0)

    return stdout
  }
}

describe('Audit', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('authenticate() should invoke auditing with auth argument', async () => {
    jest.spyOn(global.console, 'log')

    execFile.mockImplementation(() => {
      const process = new ChildProcessSuccessMock()
      return process
    })

    const audit = new Audit()
    await audit.authenticate()

    expect(execFile).toHaveBeenCalled()
    expect(execFile).toHaveBeenCalledWith(expect.anything(), ['auth'])
    expect(console.log.mock.calls).toEqual([
      [],
      ['or you can hit this link:'],
      ['  https://snyk.io/login?token=98723-28763-28g830-f2iu873b']
    ])
  })

  test('when test() returns vulns found exit code they should be returned', async () => {
    execFile.mockImplementation(
      jest.fn((file, args, options, callback) => {
        const err = new Error()
        err.code = 1
        err.stdout = JSON.stringify({ vulnsCount: 15 })
        return callback(err)
      })
    )

    const audit = new Audit()
    const data = await audit.test()

    expect(data).toEqual({
      vulnsCount: 15
    })

    expect(execFile).toHaveBeenCalled()
  })

  test('when test() not being authenticated should run the authenticate flow', async () => {
    execFile.mockImplementationOnce(
      jest.fn((file, args, options, callback) => {
        const err = new Error()
        err.code = 2
        err.stdout = JSON.stringify({ vulnsCount: 15 })
        return callback(err)
      })
    )

    execFile.mockImplementationOnce(
      jest.fn((file, args, options, callback) => {
        const err = new Error()
        err.code = 1
        err.stdout = JSON.stringify({ vulnsCount: 15 })
        return callback(err)
      })
    )

    const audit = new Audit()

    const spy = jest.spyOn(audit, 'authenticate')
    audit.authenticate.mockResolvedValue(true)

    await audit.test()

    expect(audit.authenticate).toHaveBeenCalled()
    spy.mockRestore()
  })
})
