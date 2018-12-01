[![Build Status](https://travis-ci.org/zeezia/comprehensive-js-coverage.svg?branch=master)](https://travis-ci.org/zeezia/comprehensive-js-coverage) [![Coverage Status](https://coveralls.io/repos/github/zeezia/comprehensive-js-coverage/badge.svg?branch=master)](https://coveralls.io/github/zeezia/comprehensive-js-coverage?branch=master)

Comprehensive JS Coverage
=========

A library to provide comprehensive unit test coverage of your code considering opened PRs &amp; ownerships to avoid double efforts, hence increasing productivity.

## Installation

  `npm install comprehensive-js-coverage`

## Usage
  ```
  var coverage = require('comprehensive-js-coverage');

  coverage('repo_name', 'repo_owner', 'base_branch');
  ```
  This would generate a `/comprehensive_coverage` directory under project root, containing unit test coverage reports for each Pull Request branch and the base branch.

## Tests

  `npm test`