# Coveralls Bitrise proof-of-concept

[![Coverage Status](https://coveralls.io/repos/github/csantarin/coveralls-experiment/badge.svg?branch=master)](https://coveralls.io/github/csantarin/coveralls-experiment?branch=master)

## Overview

This source code demonstrates how to use Coveralls with Bitrise CI/CD in a React.js/React Native app pull requests.

Features originally built from:
- https://github.com/csantarin/keyboard-aware.git
- https://github.com/csantarin/with-staging-testid-poc.git

## Setup instructions
Replace these with your corresponding details:
- `<GITHUB_USERNAME>`: Your GitHub username
- `<GITHUB_REPONAME>`: Your GitHub repository name
- `<REPO_TOKEN_HASH_KEY>`: Your GitHub repository token as seen in your Coveralls dashboard.

1. Fork this repo. Alternatively, [create your own React Native app](https://reactnative.dev/docs/environment-setup).
2. [Add your repo to your Coveralls list.](#adding-your-repo-to-your-coveralls-list)
3. [Add the Coveralls bot to your repo so that your PRs can receive coverage comments.](#adding-the-coveralls-bot-as-a-collaborator-to-your-repo)
4. [Add the Coveralls GitHub action to your repo workflow to receive Coveralls build updates.](https://github.com/marketplace/actions/coveralls-github-action)
   > You can do this by simply copying this sample workflow code in [.github/workflows/main.yml](/.github/workflows/main.yml) if you don't have it yet.
5. [Add your repo to your Bitrise dashboard for build integration.](#adding-your-repo-to-your-bitrise-dashboard)
6. [Create a PR (containing some new changes) to your repo.](#creating-a-pr-with-new-commits).

### Adding @coveralls as a collaborator to your repo
You'll need to integrate the Coveralls bot to your repo in order to receive PR comments on test coverage.

See also: https://github.com/lemurheavy/coveralls-public/issues/1313#issuecomment-633278912

1. On your repo, go to **Settings > Manage Access**.
2. Click **Invite a collaborator**.
3. Enter `coveralls`.
4. Click **Add coveralls to [your-repo]**.
5. Wait for the Coveralls bot to accept your invitation within 10 minutes.

### Adding your repo to your Coveralls list.
1. Connect to [Coveralls](https://coveralls.io/) using your GitHub account.
2. [Add your repo to your Coveralls list.](https://coveralls.io/repos/new)
3. Visit your Coveralls repo settings at `https://coveralls.io/github/<GITHUB_USERNAME>/<GITHUB_REPONAME>/settings`
4. Enable notifications under **PULL REQUESTS ALERTS**. Set the following:
   1. **LEAVE COMMENTS?** to `ENABLED`.
   2. **FORMAT:** to `detailed`.
   3. **COVERAGE THRESHOLD FOR FAILURE** to a percentage to indicate minimum allowed coverage.
   4. **COVERAGE DECREASE THRESHOLD FOR FAILURE** to a percentage to indicate minimum allowed loss of coverage.

### Adding your repo to your Bitrise dashboard.
As of 2020-09-07, Bitrise cannot trigger the @coveralls bot to produce comments on GitHub PRs. [Coveralls doesn't support Bitrise integration](https://docs.coveralls.io/supported-ci-services), which is why GitHub actions is necessary.

These instructions assume that you use the preconfigured Bitrise workflow without any changes.

1. Connect to [Bitrise](https://app.bitrise.io/users/sign_in) with your GitHub account.
2. Follow the steps outlined in [this video tutorial](https://www.youtube.com/watch?v=dG5I9qWDbQE) to add your repos to Bitrise.
3. Configure your repo's Bitrise triggers to run the build (upon push / pull request / tag) as required. The target workflow should be `primary`.

### Creating a PR with new commits
These instructions assume that you have these tools as dependencies to your project.
- [`jest`](https://www.npmjs.com/package/jest) : testing the code and generating test reports
- [`coveralls`](https://www.npmjs.com/package/coveralls) : uploading test reports to coveralls.io.

1. Clone your repo.
   ```bash
   git clone git@github.com:<GITHUB_USERNAME>/<GITHUB_REPONAME>.git
   # or
   git clone https://github.com/<GITHUB_USERNAME>/<GITHUB_REPONAME>.git
   ```
   > If you prefer to not fork this repo, you may create your own, but take note of the minimum Node dependencies above.
2. Install its dependencies.
   ```bash
   yarn
   ```
3. Make changes.
4. Run tests to make sure that your code doesn't fail.
   ```bash
   yarn test
   ```

The following instructions assumes that you use other CI integration besides Bitrise, or when you choose to upload test reports manually.
1. *(optional)* Create a **.coveralls.yml** file using [.coveralls.example.yml](.coveralls.example.yml) as reference. Replace `<REPO_TOKEN_HASH_KEY>` accordingly.
2. *(optional)* Upload your local test results to Coveralls for immediate reports. See [package.json](package.json) for reference.
   ```bash
   yarn coverage
   ```
