# GitHub Publication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the completed lesson website from local `main` to a new public GitHub repository named `demo-english-for-everyone-4` and confirm its GitHub Pages deployment.

**Architecture:** Prepare and verify the website title entirely locally, then fast-forward `main` to the completed feature history. Pause for explicit remote-command approval before using GitHub CLI to authenticate, guard against an existing repository, create the public repository, enable workflow-based Pages, push `main`, and monitor deployment.

**Tech Stack:** React, TypeScript, Vite, Vitest, Playwright, Git, GitHub CLI, GitHub Actions, GitHub Pages

## Global Constraints

- Repository name: `demo-english-for-everyone-4`.
- Website title in README and page metadata: `Demo-English-for-Everyone-4`.
- Repository visibility: public.
- Preserve all existing commits; do not squash, rewrite, or force-push.
- Keep visible Ami Connect lesson branding and lesson content unchanged.
- `.github/workflows/deploy.yml` must be included on remote `main`.
- Do not run any remote GitHub command until the user gives separate explicit approval.
- If the repository name already exists in the authenticated account, stop before any mutation and ask the user.

---

### Task 1: Website title and deployment metadata

**Files:**
- Modify: `tests/lesson.spec.ts`
- Modify: `index.html`
- Modify: `README.md`
- Modify: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: the production page served from `index.html`.
- Produces: exact browser title `Demo-English-for-Everyone-4`, matching README heading and workflow display name.

- [ ] **Step 1: Write the failing page-title test**

Add this assertion immediately after `await page.goto('/')` in the complete lesson journey:

```ts
await expect(page).toHaveTitle('Demo-English-for-Everyone-4');
```

- [ ] **Step 2: Run the focused end-to-end test to verify it fails**

Run:

```bash
npm run test:e2e -- --grep "teacher can complete every lesson stage"
```

Expected: FAIL because the current title is `Ami Connect | English Demo Lesson`.

- [ ] **Step 3: Update the exact title metadata**

Change the README first line to:

```md
# Demo-English-for-Everyone-4
```

Change the HTML metadata to:

```html
<meta
  name="description"
  content="Demo-English-for-Everyone-4 — an interactive Ami Connect English demo lesson."
/>
<meta name="application-name" content="Demo-English-for-Everyone-4" />
<title>Demo-English-for-Everyone-4</title>
```

Change the workflow name to:

```yaml
name: Deploy Demo-English-for-Everyone-4 to GitHub Pages
```

Do not change `src/data/lessonContent.ts` or the Ami Connect logo and header.

- [ ] **Step 4: Run the focused end-to-end test to verify it passes**

Run:

```bash
npm run test:e2e -- --grep "teacher can complete every lesson stage"
```

Expected: 1 passing test.

- [ ] **Step 5: Run complete local verification**

Run each command separately:

```bash
npm test
npm run test:e2e
npm run build
git diff --check
```

Expected:

- 29 unit/component tests pass.
- 2 Playwright tests pass.
- TypeScript and Vite production build pass.
- Git reports no whitespace errors.

- [ ] **Step 6: Commit the local publication metadata**

```bash
git add README.md index.html .github/workflows/deploy.yml tests/lesson.spec.ts
git diff --cached --check
git commit -m "chore: prepare GitHub Pages publication"
```

### Task 2: Align the completed history with local main

**Files:**
- No file content changes.
- Git refs: `main`, `feature/topic-think-speak-timer`.

**Interfaces:**
- Consumes: the verified publication metadata commit at the feature branch tip.
- Produces: local `main` pointing at the same completed commit.

- [ ] **Step 1: Confirm the worktree is clean and inspect the branch relationship**

```bash
git status -sb
git log --oneline --decorate --graph --all -15
```

Expected: clean feature branch, with `main` as an ancestor.

- [ ] **Step 2: Fast-forward main**

```bash
git switch main
git merge --ff-only feature/topic-think-speak-timer
```

Expected: `main` advances without a merge commit.

- [ ] **Step 3: Verify local publication state**

```bash
git status -sb
git log -1 --oneline
git ls-files .github/workflows/deploy.yml
gh --version
```

Expected: clean `main`, workflow file tracked, and GitHub CLI installed. This
step does not authenticate or contact GitHub.

- [ ] **Step 4: Obtain explicit remote-command approval**

Report the local commit, passing verification, current branch, and tracked
workflow. Ask the user:

> Local preparation is complete. Do you approve running the remote GitHub
> commands to check authentication and repository availability, and—only if
> the name is available—create the public repository, enable Pages, push
> `main`, and monitor deployment?

Stop until the user explicitly approves.

### Task 3: Create and deploy the public GitHub repository

**Files:**
- Remote repository: the authenticated account’s `demo-english-for-everyone-4`
- Remote branch: `main`
- Remote workflow: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: explicit remote approval and a clean verified local `main`.
- Produces: public GitHub repository URL, terminal Actions status, and GitHub Pages URL.

- [ ] **Step 1: Check GitHub CLI authentication**

```bash
gh auth status
gh api user --jq .login
```

Expected: authenticated account login. Record the exact login returned by the
second command. If authentication fails, stop and ask the user to run
`gh auth login`.

- [ ] **Step 2: Check repository-name availability**

```bash
gh repo view \
  "$(gh api user --jq .login)/demo-english-for-everyone-4" \
  --json nameWithOwner,url,visibility
```

If the command succeeds, the repository exists: stop immediately and ask the
user before doing anything else. If it returns an authenticated not-found
response, continue. Any other error is a blocker and must be reported.

- [ ] **Step 3: Create the public repository**

```bash
gh repo create demo-english-for-everyone-4 \
  --public \
  --source=. \
  --remote=origin \
  --description "Demo-English-for-Everyone-4 interactive English lesson"
```

Expected: a new empty public repository and an `origin` remote.

- [ ] **Step 4: Enable workflow-based GitHub Pages**

```bash
gh api \
  --method POST \
  repos/{owner}/{repo}/pages \
  -f build_type=workflow
```

Expected: Pages site configuration with workflow builds enabled.

- [ ] **Step 5: Push local main**

```bash
git push -u origin main
```

Expected: all existing commits pushed and `main` tracking `origin/main`.

- [ ] **Step 6: Confirm workflow inclusion on remote main**

```bash
gh api \
  "repos/{owner}/{repo}/contents/.github/workflows/deploy.yml?ref=main" \
  --jq .path
```

Expected: `.github/workflows/deploy.yml`.

- [ ] **Step 7: Identify and monitor the Pages workflow**

```bash
gh run list \
  --workflow deploy.yml \
  --branch main \
  --limit 1 \
  --json databaseId,status,conclusion,url,workflowName
```

Then resolve that run and watch it to completion:

```bash
latest_run_id="$(
  gh run list \
    --workflow deploy.yml \
    --branch main \
    --limit 1 \
    --json databaseId \
    --jq '.[0].databaseId'
)"
gh run watch "$latest_run_id" --exit-status
```

Expected: workflow conclusion `success`. If it fails, inspect the run logs and
report the cause before requesting approval for any additional remote change.

- [ ] **Step 8: Read and verify the GitHub Pages URL**

```bash
gh api \
  repos/{owner}/{repo}/pages \
  --jq '{html_url: .html_url, status: .status, build_type: .build_type}'
```

Expected:

- `build_type` is `workflow`.
- `status` is `built`.
- `html_url` is the final public website URL.

- [ ] **Step 9: Final report**

Provide:

- the exact repository URL returned by `gh repo view --json url --jq .url`
- the final GitHub Actions workflow status and run URL
- the GitHub Pages `html_url`
- the local and pushed commit SHA
- confirmation that no force-push or unrelated repository mutation occurred
