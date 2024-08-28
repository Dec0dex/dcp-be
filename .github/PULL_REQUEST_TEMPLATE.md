<!--
     For Work In Progress Pull Requests, please use the Draft PR feature,
     see https://github.blog/2019-02-14-introducing-draft-pull-requests/ for further details.

     For a timely review/response, please avoid force-pushing additional
     commits if your PR already received reviews or comments.

     Before submitting a Pull Request, please ensure you've done the following:
     - 📖 Read the Decodex Code of Conduct: https://github.com/Dec0dex/dcp-web/blob/main/CODE_OF_CONDUCT.md
     - 👷‍♀️ Create small PRs. In most cases this will be possible.
     - ✅ Provide tests for your changes.
     - 📝 Use descriptive commit messages.
     - 📗 Update any related documentation and include any relevant screenshots.

     NOTE: Pull Requests from forked repositories will need to be reviewed by
     a Decodex Team member before any CI builds will run. Once your PR is approved
     with a `/ci` reply to the PR, it will be allowed to run subsequent builds without
     manual approval.
-->

## What type of PR is this?
<!-- Choose only something to come under. -->

- 🐛 Bug Fix
- 👍 Improvement
- ✨ New Feature
- 🎉 Release
- ♻️ Refactoring
- 🚿 Refactoring (Remove functions)
- 💚 Refactoring (Test or CI)
- 👕 Fix (Lint)
- 🆙 Update (Dependency packages)
- 🚀 Improvement (Performance)
- 👮 Improvement (Security)
- 🔒 Restriction (Restrict new feature)
- 👾 Others


## Description

## Solution

## Related Tickets & Documents

<!--
For pull requests that relate or close an issue, please include them
below.  We like to follow [Github's guidance on linking issues to pull requests](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue).

For example having the text: "closes #1234" would connect the current pull
request to issue 1234.  And when we merge the pull request, Github will
automatically close the issue.
-->

- Related Issue #
- Closes #
- [JIRA](https://decodexpr.atlassian.net/browse/DCP-1)

## QA Instructions, Screenshots, Recordings

_Please replace this line with instructions on how to test your changes, a note
on the devices and browsers this has been tested on, as well as any relevant
images for UI changes._

## Feature Flags
<!--
If applicable please provide feature flags that needs to be set in order to test your code
-->

- [feature-flag]()

## Added/updated documentation?
_We encourage you to keep the documentation up to date._

- [ ] Confluence
- [ ] VuePress
- [ ] No, and this is why: _please replace this line with details on why documentation
      have not been written_
- [ ] I need help with writing documentation

## Added/updated tests?
_We encourage you to keep the code coverage percentage at 80% and above._

- [ ] Yes
- [ ] No e2e Tests
- [ ] No, and this is why: _please replace this line with details on why tests
      have not been included_
- [ ] I need help with writing tests

## Self Checklist
- [ ] 1. Build successfully on local
- [ ] 2. Format all code files included in the PR
- [ ] 3. No more unconfirmed specs in the PR
- [ ] 4. Tested the normal case and error cases following specs
- [ ] 5. Is there a refactor to the old code? If yes, have you tested the old function and noted the impact yet?
- [ ] 6. Loops have a set length and correct termination conditions
- [ ] 7. There aren't any redundant or duplicate codes in PR (clean code)
- [ ] 8. There aren't any hard-coded in the code in PR
- [ ] 9. Optimization logic handling and optimizations SQL (for example, don't get redundant data or add an index to optimize performance, query only necessary fields...)
- [ ] 10. Update issue status and add PR link to the issue
- [ ] 11. Is there entity change? If yes, have you generated new migration file and updated seeder files?
- [ ] 12. I have used i18n for the strings

## [optional] Are there any post deployment tasks we need to perform?

## [optional] What gif best describes this PR or how it makes you feel?

![alt_text](gif_link)
