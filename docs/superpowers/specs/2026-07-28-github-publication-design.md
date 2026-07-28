# GitHub Publication Design

## Goal

Publish the completed lesson website to a new public GitHub repository named
`demo-english-for-everyone-4`, preserving the existing commit history and
deploying the production build with GitHub Pages.

## Local preparation

- Keep the Ami Connect branding inside the lesson unchanged.
- Change the README heading to `Demo-English-for-Everyone-4`.
- Set the HTML page title and application metadata to
  `Demo-English-for-Everyone-4`.
- Keep `.github/workflows/deploy.yml` and update its display name to match the
  website title.
- Add an end-to-end assertion for the browser page title.
- Run the complete unit test suite, end-to-end suite, typecheck, and production
  build.
- Commit the metadata and test changes.
- Fast-forward local `main` to the completed feature branch so the existing
  commits are preserved without an unnecessary merge commit.

## Remote publication

No remote GitHub command will run until the user gives a separate explicit
approval after local preparation is complete.

After approval:

1. Check that GitHub CLI is installed and authenticated.
2. Determine the authenticated GitHub account.
3. Check whether `demo-english-for-everyone-4` already exists in that account.
4. If it exists, stop without creating, changing, or pushing anything and ask
   the user how to proceed.
5. If it does not exist, create a new public repository without initializing
   additional files.
6. Add the new repository as `origin` and push local `main`.
7. Confirm that `.github/workflows/deploy.yml` is present on the remote.
8. Monitor the GitHub Actions Pages workflow to a terminal result.
9. Report the repository URL, workflow status, and final GitHub Pages URL.

## GitHub Pages behavior

The existing Vite configuration uses a relative base path, so the production
assets work under the repository Pages path. The existing deployment workflow
runs tests, builds `dist/`, uploads the Pages artifact, and deploys it from
pushes to `main`.

## Failure handling

- Authentication failure: stop and ask the user to authenticate GitHub CLI.
- Existing repository name: stop before any mutation and ask the user.
- Test or build failure: fix locally and rerun verification before publication.
- Repository creation or push failure: stop, report the exact error, and do not
  retry with a destructive or broader command.
- Workflow failure: inspect the Actions logs, report the cause, and request
  approval before making any additional remote change outside the approved
  publication flow.

## Out of scope

- Changing the lesson’s visible Ami Connect branding or lesson content.
- Publishing a pull request.
- Rewriting, squashing, or force-pushing existing commits.
- Creating or modifying any repository other than
  `demo-english-for-everyone-4`.
