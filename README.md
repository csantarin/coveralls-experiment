# Coveralls proof-of-concept

[![Coverage Status](https://coveralls.io/repos/github/csantarin/coveralls-experiment/badge.svg?branch=master)](https://coveralls.io/github/csantarin/coveralls-experiment?branch=master)

## Overview

This source code demonstrates how to use Coveralls in a React.js/React Native app tests.

Features originally built from:
- https://github.com/csantarin/keyboard-aware.git
- https://github.com/csantarin/with-staging-testid-poc.git

## Usage

1. Fork this repo.
2. Clone your fork of this repo.

	> Replace `<YOUR_GITHUB_USERNAME>` with... your GitHub username.

	```bash
	git clone git@github.com:<YOUR_GITHUB_USERNAME>/coveralls-experiment.git
	# or
	git clone https://github.com/<YOUR_GITHUB_USERNAME>/coveralls-experiment.git
	```

3. Install its dependencies.

	```bash
	yarn
	```

4. Connect to [Coveralls](https://coveralls.io/) using your GitHub account.
5. [Add your fork of this repo to your Coveralls list.](https://coveralls.io/repos/new)
6. Obtain your Coveralls repo token from the repo details view in the Coveralls dashboard.

	> Replace `<YOUR_GITHUB_USERNAME>` with... your GitHub username.

	```bash
	open https://coveralls.io/github/<YOUR_GITHUB_USERNAME>/coveralls-experiment
	```

7. Create a `.coveralls.yml` file with this token.

	> Replace `<YOUR_COVERALLS_REPO_TOKEN>` with... your coveralls repo token.

	```bash
	echo "repo_token: <YOUR_COVERALLS_REPO_TOKEN>" > .coveralls.yml
	```

8. Run the repo's tests.

	```bash
	yarn test
	```

9. Upload the test results to your Coveralls dashboard.

	```bash
	yarn coveralls
	# or
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js
	```

## To-dos

* [ ] Integration with Bitrise CI/CD.
