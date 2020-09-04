# Coveralls Bitrise proof-of-concept

[![Coverage Status](https://coveralls.io/repos/github/csantarin/coveralls-experiment/badge.svg?branch=master)](https://coveralls.io/github/csantarin/coveralls-experiment?branch=master)

## Overview

This source code demonstrates how to use Coveralls with Bitrise CI/CD in a React.js/React Native app tests.

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

	> Replace `<YOUR_COVERALLS_REPO_TOKEN>` with... your Coveralls repo token.

	```bash
	echo "service_name: bitrise" >> .coveralls.yml
	echo "repo_token: <YOUR_COVERALLS_REPO_TOKEN>" >> .coveralls.yml
	```

	> **[!NOTE]** You may also forgo this step if you prefer to create this file in the Bitrise script step setup below.

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

10. Connect to [Bitrise](https://app.bitrise.io/users/sign_in), preferrably with your GitHub account.
11. Follow the steps outlined in [this video tutorial](https://www.youtube.com/watch?v=dG5I9qWDbQE) to add your repo to Bitrise.
12. Visit your repo on Bitrise.
13. Switch over to the **Workflows** tab.
14. Set a script up on the "primary" workflow just before `test` "Run yarn command" step.

	```bash
	#!/usr/bin/env bash
	set -e
	set -x

	echo "Setting the coveralls repo token..."
	echo "git_branch: $BITRISE_GIT_BRANCH" >> .coveralls.yml

	# Add the following lines if you skipped step 7.
	echo "repo_token: $COVERALLS_REPO_TOKEN" >> .coveralls.yml
	echo "service_name: bitrise" >> .coveralls.yml
	```

15. Save your workflow.
16. Switch over to the **Secrets** tab and add your Coveralls repo token if you've skipped step 7. Create the following:

	> Replace `<YOUR_COVERALLS_REPO_TOKEN>` with... your Coveralls repo token.

    COVERALLS_REPO_TOKEN = `<YOUR_COVERALLS_REPO_TOKEN>`

	Slide the **Expose for Pull Requests?** option to the right if you also plan to apply Bitrise builds to GitHub pull requests.

## To-dos

* [x] ~~Instructions to integrate the repo with Bitrise CI/CD.~~
* [x] Instructions to integrate the repo with Coveralls bot after CI/CD build succeeds.
