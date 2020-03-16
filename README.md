<p align="center"><h1 align="center">
  pie-my-vulns
</h1>

<p align="center">
  Visualize your project security vulnerabilities as a pie chart in the terminal
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/pie-my-vulns"><img src="https://badgen.net/npm/v/pie-my-vulns" alt="npm version"/></a>
  <a href="https://www.npmjs.org/package/pie-my-vulns"><img src="https://badgen.net/npm/license/pie-my-vulns" alt="license"/></a>
  <a href="https://www.npmjs.org/package/pie-my-vulns"><img src="https://badgen.net/npm/dt/pie-my-vulns" alt="downloads"/></a>
  <a href="https://circleci.com/gh/lirantal/security-report"><img src="https://circleci.com/gh/lirantal/security-report.svg?style=svg" alt="build"/></a>
  <a href="https://codecov.io/gh/lirantal/pie-my-vulns"><img src="https://badgen.net/codecov/c/github/lirantal/pie-my-vulns" alt="codecov"/></a>
  <a href="https://snyk.io/test/github/lirantal/pie-my-vulns"><img src="https://snyk.io/test/github/lirantal/pie-my-vulns/badge.svg" alt="Known Vulnerabilities"/></a>
  <a href="./SECURITY.md"><img src="https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg" alt="Responsible Disclosure Policy" /></a>
</p>

<p align="center">
  <img src="./.github/pie-my-vulns-logo.svg" height="150px" alt="Screenshot of npm module called pie-my-vulns that draws pie charts in the terminal reflecting security vulnerabilities found in JavaScript and Node.js projects based on Snyk vulnerability database" />
  
  <p align="center">
  	<p align="center">Many thanks to <a href="https://snyk.io"><img src="./.github/snyk-logo.png" width="100"></a> for supporting open source security</p>
    
</p>

# About

Visualize your project security vulnerabilities as a pie chart in the terminal

# Usage

## Command line

Using Node.js's npx command to run a one-off scan inside a project's directory:

```bash
npx pie-my-vulns
```

To scan a specific project directory use the `--directory` option, for example:

```bash
npx pie-my-vulns --directory=path/to/project/dir
```

# Install

You can install globally via:

```bash
npm install -g pie-my-vulns
```

# Contributing

Please consult [CONTRIBUTING](./CONTRIBUTING.md) for guidelines on contributing to this project.

# Author

**pie-my-vulns** © [Liran Tal](https://github.com/lirantal), Released under the [Apache-2.0](./LICENSE) License.
