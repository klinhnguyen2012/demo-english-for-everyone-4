# Ami Connect Interactive Demo Lesson Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, reusable 25-minute English demo lesson as a static Vite React application ready for local use and GitHub Pages.

**Architecture:** A single `LessonApp` owns navigation and shared lesson state while focused stage components own their interactions. Editable copy comes exclusively from a typed content module; reusable hooks/components isolate countdown, speech, recording, and fullscreen browser capabilities. Vitest/Testing Library cover behavior and Playwright covers the integrated 1366×768 classroom experience.

**Tech Stack:** Vite, React 19, TypeScript, clean CSS, Lucide React, Vitest, Testing Library, Playwright.

## Global Constraints

- Use the supplied logo unchanged at `public/assets/ami_connect_logo.jpeg`.
- Use relative assets and `base: './'` so the build works at any GitHub Pages repository path.
- Do not use a backend, login, database, API key, paid service, or automatic pronunciation judgment.
- Keep all editable lesson copy and question data in `src/data/lessonContent.ts`.
- Do not display student name, age, or level.
- Keep open speaking prompts free of model answers.
- Preserve lesson progress and stage state when navigating backward.
- Make microphone, speech synthesis, clipboard, and fullscreen failures non-blocking.
- Meet the 1366×768 screen-sharing target without document scrolling in stages 1–7.

---

## File Map

- `package.json`: scripts and runtime/test dependencies.
- `vite.config.ts`: React plugin, relative base, and Vitest configuration.
- `tsconfig*.json`: strict TypeScript configuration.
- `index.html`: static entry document and application metadata.
- `src/main.tsx`: React root.
- `src/App.tsx`: classroom shell, stage routing, global timer, restart, keyboard navigation.
- `src/data/lessonContent.ts`: typed, editable lesson content.
- `src/types/lesson.ts`: shared content and feedback types.
- `src/hooks/useCountdown.ts`: reusable start/pause/reset countdown.
- `src/hooks/useSpeechSynthesis.ts`: browser speech controls and capability state.
- `src/hooks/useAudioRecorder.ts`: MediaRecorder lifecycle and local URL cleanup.
- `src/components/ClassroomHeader.tsx`: logo, progress, lesson timer, fullscreen, notes.
- `src/components/LessonNavigation.tsx`: Back/Next controls.
- `src/components/StageFrame.tsx`: common stage heading and activity container.
- `src/components/SpeakingTimer.tsx`: accessible countdown controls.
- `src/components/AudioRecorder.tsx`: record/stop/replay UI and fallback notice.
- `src/stages/*.tsx`: Welcome, Listening, TopicChoice, StrongerAnswer, TeacherQuestions, SpeakingMission, and FinalChallenge.
- `src/feedback/FeedbackPanel.tsx`: feedback form and output actions.
- `src/feedback/generateSummary.ts`: deterministic local summary builder.
- `src/styles.css`: brand system, responsive classroom layout, animation, and print view.
- `src/test/setup.ts`: DOM test matchers and browser API shims.
- `src/**/*.test.ts(x)`: behavior tests adjacent to production units.
- `tests/lesson.spec.ts`: integrated browser journey.
- `.github/workflows/deploy.yml`: GitHub Pages build/deploy.
- `README.md`: local and GitHub Pages instructions.

---

### Task 1: Project Foundation, Typed Content, and Summary Logic

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`
- Create: `src/main.tsx`, `src/types/lesson.ts`, `src/data/lessonContent.ts`
- Create: `src/feedback/generateSummary.test.ts`
- Create: `src/feedback/generateSummary.ts`
- Create: `src/test/setup.ts`
- Create: `.gitignore`
- Copy: `public/assets/ami_connect_logo.jpeg`

**Interfaces:**
- Produces: `lessonContent: LessonContent`.
- Produces: `generateFeedbackSummary(input: FeedbackInput): string`.

- [ ] **Step 1: Add the Vite/Vitest project configuration and test setup**

Use scripts `dev`, `build: vite build`, `typecheck: tsc -b`, `test: vitest run`,
`test:watch: vitest`, `test:e2e: playwright test`, and `preview: vite preview`.
Configure Vite with `base: './'`, React, jsdom, and `src/test/setup.ts`.

- [ ] **Step 2: Write the failing summary tests**

```ts
it('combines selected ratings and teacher comments into a parent-ready summary', () => {
  expect(generateFeedbackSummary({
    ratings: { Listening: 'Strong', Fluency: 'Developing' },
    strength1: 'Explained ideas clearly.',
    strength2: 'Asked thoughtful questions.',
    nextStep: 'Use more linking phrases.',
    parentSummary: 'A confident first lesson.',
  })).toContain('Listening: Strong');
});

it('labels missing categories as not yet rated instead of guessing', () => {
  expect(generateFeedbackSummary(emptyFeedback)).toContain('Listening: not yet rated');
});
```

- [ ] **Step 3: Run the summary test and verify RED**

Run `npm test -- src/feedback/generateSummary.test.ts`. Expected: failure
because `generateFeedbackSummary` does not exist.

- [ ] **Step 4: Implement types, complete lesson content, and summary generation**

Define typed stages, closed-question answer keys, feedback categories, and
rating labels. Implement summary output from literal ratings and non-empty
comments without external calls.

- [ ] **Step 5: Run type checking and the summary tests**

Run `npm run typecheck` and `npm test -- src/feedback/generateSummary.test.ts`.
Expected: both exit 0.

- [ ] **Step 6: Commit**

Commit as `feat: establish lesson content and project foundation`.

---

### Task 2: Reusable Timers and Classroom Shell

**Files:**
- Create: `src/hooks/useCountdown.test.tsx`
- Create: `src/hooks/useCountdown.ts`
- Create: `src/components/ClassroomHeader.tsx`
- Create: `src/components/LessonNavigation.tsx`
- Create: `src/components/StageFrame.tsx`
- Create: `src/components/SpeakingTimer.tsx`
- Create: `src/App.test.tsx`
- Create: `src/App.tsx`

**Interfaces:**
- Produces: `useCountdown({ initialSeconds, autoStart? })` with
  `{ secondsLeft, isRunning, start, pause, reset }`.
- Consumes: `lessonContent`.
- Produces: eight-position stage navigation and a 25-minute timer.

- [ ] **Step 1: Write failing timer tests**

```tsx
it('counts down only while running and stops at zero', () => {
  const { result } = renderHook(() => useCountdown({ initialSeconds: 2 }));
  act(() => result.current.start());
  act(() => vi.advanceTimersByTime(3000));
  expect(result.current.secondsLeft).toBe(0);
  expect(result.current.isRunning).toBe(false);
});
```

- [ ] **Step 2: Run the timer test and verify RED**

Run `npm test -- src/hooks/useCountdown.test.tsx`. Expected: module-not-found
failure for `useCountdown`.

- [ ] **Step 3: Implement the countdown and verify GREEN**

Use a one-second interval that is cleared on pause, zero, reset, and unmount.
Run `npm test -- src/hooks/useCountdown.test.tsx`. Expected: pass.

- [ ] **Step 4: Write failing shell navigation tests**

```tsx
it('moves forward, backward, and by arrow keys without leaving bounds', async () => {
  render(<App />);
  await user.click(screen.getByRole('button', { name: /next/i }));
  expect(screen.getByRole('heading', { name: 'Listen carefully' })).toBeVisible();
  fireEvent.keyDown(window, { key: 'ArrowLeft' });
  expect(screen.getByRole('heading', { name: 'Let’s get started!' })).toBeVisible();
});
```

- [ ] **Step 5: Run the shell test and verify RED**

Run `npm test -- src/App.test.tsx`. Expected: failure because the classroom
shell is absent.

- [ ] **Step 6: Implement the shell and verify GREEN**

Implement stage progress, navigation bounds, input-safe arrow shortcuts,
global timer, notes toggle, fullscreen state/fallback, and restart reset key.
Run `npm test -- src/App.test.tsx src/hooks/useCountdown.test.tsx`.

- [ ] **Step 7: Commit**

Commit as `feat: add classroom shell and lesson navigation`.

---

### Task 3: Welcome, Listening, and Topic Choice

**Files:**
- Create: `src/hooks/useSpeechSynthesis.test.tsx`
- Create: `src/hooks/useSpeechSynthesis.ts`
- Create: `src/hooks/useAudioRecorder.test.tsx`
- Create: `src/hooks/useAudioRecorder.ts`
- Create: `src/components/AudioRecorder.tsx`
- Create: `src/stages/WelcomeStage.test.tsx`, `src/stages/WelcomeStage.tsx`
- Create: `src/stages/ListeningStage.test.tsx`, `src/stages/ListeningStage.tsx`
- Create: `src/stages/TopicChoiceStage.test.tsx`, `src/stages/TopicChoiceStage.tsx`

**Interfaces:**
- Produces: speech controller with play, pause/resume, replay, speed, and support state.
- Produces: recorder controller with idle/recording/ready/error states and local playback URL.
- Consumes: the first three stage content entries.

- [ ] **Step 1: Write failing browser-capability tests**

Test that speech creates an utterance with the selected rate, replay cancels
before speaking, microphone rejection becomes an error state, and recording
creates then revokes a local object URL.

- [ ] **Step 2: Run the capability tests and verify RED**

Run `npm test -- src/hooks/useSpeechSynthesis.test.tsx src/hooks/useAudioRecorder.test.tsx`.
Expected: missing-module failures.

- [ ] **Step 3: Implement speech and recording hooks**

Keep unsupported or denied capabilities non-blocking. Stop browser resources
on unmount. Run the capability tests and expect all to pass.

- [ ] **Step 4: Write failing stage tests**

```tsx
it('reveals a conversation prompt only after a mood is selected', async () => {
  render(<WelcomeStage content={welcome} />);
  expect(screen.queryByText(/How has your day/)).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Great' }));
  expect(screen.getByText(/How has your day/)).toBeVisible();
});
```

Listening tests must prove the transcript starts hidden, answer feedback is
hidden until “Check answer,” and question 3 includes a 30-second timer.
Topic tests must prove topic selection, follow-up progression, and
vocabulary-only support.

- [ ] **Step 5: Run the stage tests and verify RED**

Run the three stage test files. Expected: missing-component failures.

- [ ] **Step 6: Implement stages 1–3 and verify GREEN**

Render only requested prompts and use staged teacher-triggered reveals.
Run all unit/component tests and expect exit 0.

- [ ] **Step 7: Commit**

Commit as `feat: add welcome listening and topic stages`.

---

### Task 4: Structured Answer, Teacher Conversation, Mission, and Final Challenge

**Files:**
- Create: `src/stages/StrongerAnswerStage.test.tsx`, `src/stages/StrongerAnswerStage.tsx`
- Create: `src/stages/TeacherQuestionsStage.test.tsx`, `src/stages/TeacherQuestionsStage.tsx`
- Create: `src/stages/SpeakingMissionStage.test.tsx`, `src/stages/SpeakingMissionStage.tsx`
- Create: `src/stages/FinalChallengeStage.test.tsx`, `src/stages/FinalChallengeStage.tsx`

**Interfaces:**
- Consumes: stages 4–7 from `lessonContent`.
- Produces: keyboard-accessible ordering, gated teacher questions, five mission
  checkpoints, and final 90-second speaking task.

- [ ] **Step 1: Write failing stage tests**

Test step-by-step answer reveals, mixed initial order, drag reorder, Move
Up/Down access, check-order gating, teacher follow-up gating, checkpoint
completion, keyword hiding, and 90-second timer controls.

- [ ] **Step 2: Run tests and verify RED**

Run the four new test files. Expected: missing-component failures.

- [ ] **Step 3: Implement the four stages**

Use HTML drag events plus explicit reorder buttons. Show “Mission completed!”
only when every checkpoint is selected. Use phrase support without adding
model answers or a dialogue script.

- [ ] **Step 4: Run all tests and verify GREEN**

Run `npm test`. Expected: all tests pass with no warnings.

- [ ] **Step 5: Commit**

Commit as `feat: complete guided speaking stages`.

---

### Task 5: Feedback, Visual System, and Deployment Documentation

**Files:**
- Create: `src/feedback/FeedbackPanel.test.tsx`
- Create: `src/feedback/FeedbackPanel.tsx`
- Create: `src/styles.css`
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `generateFeedbackSummary`, rating categories, and restart callback.
- Produces: completed application, print layout, and GitHub Pages workflow.

- [ ] **Step 1: Write failing feedback tests**

```tsx
it('generates, copies, and resets a local teacher summary', async () => {
  render(<FeedbackPanel onRestart={onRestart} />);
  await user.click(screen.getByLabelText('Listening Strong'));
  await user.type(screen.getByLabelText('Strength 1'), 'Explained ideas clearly.');
  await user.click(screen.getByRole('button', { name: 'Generate summary' }));
  expect(screen.getByRole('textbox', { name: 'Generated summary' })).toHaveValue(
    expect.stringContaining('Listening: Strong'),
  );
});
```

- [ ] **Step 2: Run feedback tests and verify RED**

Run `npm test -- src/feedback/FeedbackPanel.test.tsx`. Expected:
missing-component failure.

- [ ] **Step 3: Implement feedback and verify GREEN**

Add all six rating groups, four comment fields, deterministic generation,
clipboard fallback, print, and confirmed restart. Run all tests.

- [ ] **Step 4: Implement the visual and responsive system**

Apply the supplied palette, 16:9 classroom proportions, clear focus states,
target-size controls, reduced-motion support, mission celebration, compact
feedback overflow, and feedback-only print CSS.

- [ ] **Step 5: Add GitHub Pages workflow and README**

Use official `actions/checkout`, `actions/setup-node`, `actions/configure-pages`,
`actions/upload-pages-artifact`, and `actions/deploy-pages` actions. Document
local commands, GitHub push, Pages “GitHub Actions” source, and relative paths.

- [ ] **Step 6: Run complete static verification**

Run `npm run typecheck`, `npm test`, `npm run build`, and
`rg -n "TODO|FIXME|lorem ipsum" src README.md .github || true`.
Expected: clean exits and no prohibited text.

- [ ] **Step 7: Commit**

Commit as `feat: finish lesson feedback and presentation`.

---

### Task 6: Integrated Browser Verification and Local Review

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/lesson.spec.ts`
- Modify: application/test files only when a failing browser test proves a defect.

**Interfaces:**
- Consumes: the production preview at the Vite-reported local URL.
- Produces: evidence that the complete static lesson works at 1366×768.

- [ ] **Step 1: Write the integrated browser test**

Cover all stage navigation, hidden content, listening controls, closed-answer
checking, timers, microphone denial path, topic support, ordering, teacher
question completion, mission completion, final keywords, feedback summary,
copy, fullscreen capability, and document overflow at 1366×768.

- [ ] **Step 2: Run Playwright and verify RED**

Run `npm run test:e2e`. Expected: at least one failure before the full browser
integration/configuration is complete.

- [ ] **Step 3: Fix only defects proven by the browser test**

For each defect, add or refine the narrowest component regression test first,
confirm RED, implement the fix, then confirm GREEN.

- [ ] **Step 4: Run full verification**

Run `npm run typecheck`, `npm test`, `npm run test:e2e`, and `npm run build`.
Expected: every command exits 0.

- [ ] **Step 5: Inspect the live preview**

Open the exact Vite local URL, inspect the screenshot, accessibility tree,
console, and network activity at 1366×768. Confirm zero console errors or
warnings and no failed local asset requests.

- [ ] **Step 6: Commit**

Commit as `test: verify complete lesson journey`.

- [ ] **Step 7: Keep the preview running for user review**

Do not push or deploy. Return the live local preview and the output project
path to the user.
