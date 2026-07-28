# Topic Think–Speak Timer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the lesson header timer to 20 minutes, remove the Stage 1 timer, and add a compact two-phase Think 2:00 → Speak 1:00 timer to each Stage 3 question.

**Architecture:** Keep the global timer on the existing `useCountdown` hook and make its accessible label derive from lesson data. Add a focused `ThinkSpeakTimer` component with its own phase state so the thinking countdown can transition directly into the speaking countdown. Keep question selection in `TopicChoiceStage`, remounting the timer with a question-specific key to reset it.

**Tech Stack:** React 19, TypeScript 5.9, Vitest, Testing Library, Playwright, Vite 8, Lucide React.

## Global Constraints

- The global header timer starts at exactly 20 minutes and remains visible.
- Stage 1 has no 20-second timer.
- Only Stage 3 receives the guided Think 2:00 → Speak 1:00 cycle.
- Listening and Stage 6 do not receive the guided timer.
- Stage duration badges remain unchanged.
- All teacher-editable copy and durations stay in `src/data/lessonContent.ts`.
- Nothing is pushed to GitHub.

---

### Task 1: Update global and Stage 1 timing

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/stages/WelcomeStage.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/ClassroomHeader.tsx`
- Modify: `src/stages/WelcomeStage.tsx`
- Modify: `src/data/lessonContent.ts`
- Modify: `src/types/lesson.ts`
- Modify: `tests/lesson.spec.ts`

**Interfaces:**
- Consumes: Existing `useCountdown({ initialSeconds, autoStart })`.
- Produces: `ClassroomHeader` prop `timerDurationMinutes: number`; `LessonContent['welcome']` without `timerSeconds`.

- [ ] **Step 1: Write failing tests for the approved timer changes**

Add this assertion to the header test in `src/App.test.tsx`:

```tsx
expect(screen.getByLabelText('20-minute lesson timer')).toHaveTextContent(
  '20:00',
);
```

Replace the Stage 1 timer assertion in `src/stages/WelcomeStage.test.tsx` with:

```tsx
expect(screen.queryByLabelText(/speaking timer/i)).not.toBeInTheDocument();
```

Remove the Stage 1 timer interaction from `tests/lesson.spec.ts` and assert the header timer instead:

```ts
await expect(page.getByLabel('20-minute lesson timer')).toContainText('20:00');
await expect(
  page.getByLabel('20-second speaking timer'),
).not.toBeVisible();
```

- [ ] **Step 2: Run focused tests and verify they fail for the intended reasons**

Run:

```bash
npx vitest run src/App.test.tsx src/stages/WelcomeStage.test.tsx
```

Expected: the app still labels the header as 25 minutes and Stage 1 still renders the 20-second timer.

- [ ] **Step 3: Implement the timing changes**

In `src/data/lessonContent.ts`, set:

```ts
totalMinutes: 20,
```

Delete `welcome.timerSeconds` from the lesson data and type.

In `WelcomeStage`, remove the `SpeakingTimer` import and JSX.

Pass the lesson duration into `ClassroomHeader`:

```tsx
<ClassroomHeader
  timerDurationMinutes={lessonContent.totalMinutes}
  ...
/>
```

Use it for the accessible label:

```tsx
<div
  className="lesson-timer"
  aria-label={`${timerDurationMinutes}-minute lesson timer`}
>
```

- [ ] **Step 4: Run focused tests and verify they pass**

Run:

```bash
npx vitest run src/App.test.tsx src/stages/WelcomeStage.test.tsx
```

Expected: both test files pass.

- [ ] **Step 5: Commit the timing cleanup**

```bash
git add src/App.test.tsx src/stages/WelcomeStage.test.tsx src/App.tsx src/components/ClassroomHeader.tsx src/stages/WelcomeStage.tsx src/data/lessonContent.ts src/types/lesson.ts tests/lesson.spec.ts
git commit -m "fix: align lesson and welcome timers"
```

### Task 2: Build the two-phase timer component

**Files:**
- Create: `src/components/ThinkSpeakTimer.test.tsx`
- Create: `src/components/ThinkSpeakTimer.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `formatTime(totalSeconds: number)` from `SpeakingTimer`.
- Produces: `ThinkSpeakTimer({ thinkSeconds, speakSeconds })`.

- [ ] **Step 1: Write failing component tests**

Create `src/components/ThinkSpeakTimer.test.tsx`:

```tsx
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThinkSpeakTimer } from './ThinkSpeakTimer';

describe('ThinkSpeakTimer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('moves automatically from thinking to speaking and then completes', () => {
    render(<ThinkSpeakTimer thinkSeconds={120} speakSeconds={60} />);

    expect(screen.getByText('Think')).toBeVisible();
    expect(screen.getByText('2:00')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Start think timer' }));
    act(() => vi.advanceTimersByTime(120_000));

    expect(screen.getByText('Speak')).toBeVisible();
    expect(screen.getByText('1:00')).toBeVisible();

    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText('Time complete')).toBeVisible();
    expect(screen.getByText('0:00')).toBeVisible();
  });

  it('can pause, resume, and reset the sequence', () => {
    render(<ThinkSpeakTimer thinkSeconds={120} speakSeconds={60} />);

    fireEvent.click(screen.getByRole('button', { name: 'Start think timer' }));
    act(() => vi.advanceTimersByTime(5_000));
    fireEvent.click(screen.getByRole('button', { name: 'Pause think timer' }));
    expect(screen.getByText('1:55')).toBeVisible();

    act(() => vi.advanceTimersByTime(5_000));
    expect(screen.getByText('1:55')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Start think timer' }));
    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByText('1:54')).toBeVisible();

    fireEvent.click(
      screen.getByRole('button', { name: 'Reset think and speak timer' }),
    );
    expect(screen.getByText('Think')).toBeVisible();
    expect(screen.getByText('2:00')).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the component test and verify it fails**

Run:

```bash
npx vitest run src/components/ThinkSpeakTimer.test.tsx
```

Expected: FAIL because `ThinkSpeakTimer` does not exist.

- [ ] **Step 3: Implement the component**

Create a component with:

```tsx
interface ThinkSpeakTimerProps {
  thinkSeconds: number;
  speakSeconds: number;
}

type TimerPhase = 'think' | 'speak' | 'complete';
```

Use `phase`, `secondsLeft`, and `isRunning` state. A one-second interval decrements the current phase. When Think reaches zero, change to Speak, set `secondsLeft` to `speakSeconds`, and keep running. When Speak reaches zero, change to Complete and stop. Reset restores `Think` and `thinkSeconds`.

Render one compact `.think-speak-timer` with:

- An `aria-live="polite"` phase label.
- A tabular countdown value.
- One play/pause button with phase-specific accessible labels.
- One reset button.
- A small static phase track showing `Think 2 min → Speak 1 min`.

Add matching Ami Connect styling in `src/styles.css`, keeping the component compact and responsive.

- [ ] **Step 4: Run the component test and verify it passes**

Run:

```bash
npx vitest run src/components/ThinkSpeakTimer.test.tsx
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit the reusable timer**

```bash
git add src/components/ThinkSpeakTimer.test.tsx src/components/ThinkSpeakTimer.tsx src/styles.css
git commit -m "feat: add guided think and speak timer"
```

### Task 3: Integrate the timer into Stage 3

**Files:**
- Modify: `src/stages/TopicChoiceStage.test.tsx`
- Modify: `src/stages/TopicChoiceStage.tsx`
- Modify: `src/data/lessonContent.ts`
- Modify: `src/types/lesson.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `ThinkSpeakTimer({ thinkSeconds, speakSeconds })`.
- Produces: `topicChoice.timing` with `thinkSeconds`, `speakSeconds`, and `guidance`.

- [ ] **Step 1: Write failing Stage 3 tests**

Extend `src/stages/TopicChoiceStage.test.tsx`:

```tsx
expect(
  screen.getByText(
    'What to do? Give the student 2 minutes to think, then 1 minute to speak. Restart for each follow-up question.',
  ),
).toBeVisible();
expect(screen.getByLabelText('Think and speak timer')).toHaveTextContent(
  'Think2:00',
);
```

After clicking `Next question`, assert the timer reset:

```tsx
expect(screen.getByLabelText('Think and speak timer')).toHaveTextContent(
  'Think2:00',
);
```

Add a second test that starts the timer, advances five seconds with fake timers, changes topic, and verifies it returns to `Think 2:00`.

- [ ] **Step 2: Run the Stage 3 test and verify it fails**

Run:

```bash
npx vitest run src/stages/TopicChoiceStage.test.tsx
```

Expected: FAIL because the guidance and timer are absent.

- [ ] **Step 3: Add editable timing data and render the component**

Extend `LessonContent['topicChoice']`:

```ts
timing: {
  thinkSeconds: number;
  speakSeconds: number;
  guidance: string;
};
```

Add the approved values and guidance to `lessonContent.topicChoice`.

In `TopicChoiceStage`, render:

```tsx
<p className="teacher-guidance">{content.timing.guidance}</p>
<ThinkSpeakTimer
  key={`${selectedIndex}-${followUpIndex ?? 'main'}`}
  thinkSeconds={content.timing.thinkSeconds}
  speakSeconds={content.timing.speakSeconds}
/>
```

Place them below the current question/follow-up and above the support actions. Add compact `.teacher-guidance` styling with small gray text.

- [ ] **Step 4: Run Stage 3 and component tests**

Run:

```bash
npx vitest run src/stages/TopicChoiceStage.test.tsx src/components/ThinkSpeakTimer.test.tsx
```

Expected: all tests pass.

- [ ] **Step 5: Commit Stage 3 integration**

```bash
git add src/stages/TopicChoiceStage.test.tsx src/stages/TopicChoiceStage.tsx src/data/lessonContent.ts src/types/lesson.ts src/styles.css
git commit -m "feat: guide timed responses in topic stage"
```

### Task 4: Verify scope, responsive layout, and full lesson journey

**Files:**
- Modify: `src/stages/ListeningStage.test.tsx`
- Modify: `src/stages/SpeakingMissionStage.test.tsx`
- Modify: `tests/lesson.spec.ts`
- Modify as needed after browser inspection: `src/styles.css`

**Interfaces:**
- Consumes: the complete app and Playwright journey.
- Produces: regression coverage for the approved scope and a clean browser preview.

- [ ] **Step 1: Add scope and journey assertions**

In the Listening and Speaking Mission tests, assert:

```tsx
expect(
  screen.queryByLabelText('Think and speak timer'),
).not.toBeInTheDocument();
```

In `tests/lesson.spec.ts`, after selecting Technology:

```ts
await expect(page.getByText(/What to do\?/)).toBeVisible();
await expect(page.getByLabel('Think and speak timer')).toContainText(
  'Think2:00',
);
await page.getByRole('button', { name: 'Start think timer' }).click();
await page.getByRole('button', { name: 'Pause think timer' }).click();
await page.getByRole('button', { name: 'Next question' }).click();
await expect(page.getByLabel('Think and speak timer')).toContainText(
  'Think2:00',
);
```

- [ ] **Step 2: Run the complete automated verification suite**

Run:

```bash
npm test
npm run build
npm run test:e2e
```

Expected: all component/unit tests pass, TypeScript and Vite production build succeed, and both Playwright journeys pass.

- [ ] **Step 3: Launch local preview and inspect the browser**

Run:

```bash
npm run preview -- --host 127.0.0.1
```

Inspect at 1366×768 and a mobile width. Verify:

- Header shows 20:00 and all controls fit.
- Stage 1 has no local timer.
- Stage 3 prompt remains dominant, timer is compact, guidance is small gray copy, and question changes reset the timer.
- Listening and Stage 6 have no guided Think/Speak timer.
- The page has no unexpected document overflow.
- Browser console has zero errors and warnings.

- [ ] **Step 4: Re-run fresh final verification**

Run:

```bash
npm test
npm run build
npm run test:e2e
git diff --check
git status --short
```

Expected: all commands succeed; only intentional source, test, and plan changes are present.

- [ ] **Step 5: Commit final verification changes**

```bash
git add src/stages/ListeningStage.test.tsx src/stages/SpeakingMissionStage.test.tsx tests/lesson.spec.ts src/styles.css
git commit -m "test: verify guided topic timing journey"
```

Do not push the branch.
