# Feedback Teacher Guidance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an always-visible teacher handoff instruction below **Generate summary** that explains how to complete, generate, copy, and send feedback to Ms. Soan.

**Architecture:** Keep the copy editable in `lessonContent.feedback`, expose it through the existing `LessonContent` type, and render it in `FeedbackPanel`. Reuse the existing small gray teacher-guidance styling with a feedback-specific spacing class; do not add new sending behavior or change summary generation.

**Tech Stack:** React 19, TypeScript 5.9, Vitest, Testing Library, Playwright, Vite 8.

## Global Constraints

- Use the exact copy: `What to do? Complete all ratings and feedback notes, click Generate summary, then copy and send the summary to Ms. Soan.`
- Place the guidance directly below **Generate summary**.
- Keep it visible before and after summary generation.
- Style it as small gray supporting text, not a heading or card.
- Do not add automatic sending, new integrations, or Generate-summary validation.
- Nothing is pushed to GitHub.

---

### Task 1: Render the editable feedback guidance

**Files:**
- Modify: `src/feedback/FeedbackPanel.test.tsx`
- Modify: `src/feedback/FeedbackPanel.tsx`
- Modify: `src/data/lessonContent.ts`
- Modify: `src/types/lesson.ts`
- Modify: `src/styles.css`
- Modify: `tests/lesson.spec.ts`

**Interfaces:**
- Consumes: Existing `LessonContent['feedback']` and `FeedbackPanel`.
- Produces: `LessonContent['feedback']['guidance']: string` and an always-visible `role="note"` element labeled `Teacher handoff instructions`.

- [ ] **Step 1: Write the failing component test**

Add a focused test in `src/feedback/FeedbackPanel.test.tsx`:

```tsx
it('keeps the teacher handoff instructions visible after generating', async () => {
  const user = userEvent.setup();
  render(
    <FeedbackPanel
      content={lessonContent.feedback}
      onRestart={vi.fn()}
    />,
  );

  const guidance = screen.getByRole('note', {
    name: 'Teacher handoff instructions',
  });
  expect(guidance).toHaveTextContent(
    'What to do? Complete all ratings and feedback notes, click Generate summary, then copy and send the summary to Ms. Soan.',
  );

  await user.click(
    screen.getByRole('button', { name: 'Generate summary' }),
  );
  expect(guidance).toBeVisible();
});
```

This test catches removing the instruction, failing to pass the editable copy into the panel, or conditionally hiding it after generation.

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npx vitest run src/feedback/FeedbackPanel.test.tsx
```

Expected: FAIL because no element has the `note` role and `Teacher handoff instructions` name.

- [ ] **Step 3: Implement the editable guidance**

Extend `LessonContent['feedback']` in `src/types/lesson.ts`:

```ts
feedback: {
  title: string;
  categories: FeedbackCategory[];
  ratings: Rating[];
  guidance: string;
};
```

Add the exact copy to `lessonContent.feedback`:

```ts
guidance:
  'What to do? Complete all ratings and feedback notes, click Generate summary, then copy and send the summary to Ms. Soan.',
```

Render directly after the Generate button in `FeedbackPanel`:

```tsx
<p
  className="teacher-guidance feedback-guidance"
  role="note"
  aria-label="Teacher handoff instructions"
>
  {content.guidance}
</p>
```

Add only the spacing needed in `src/styles.css`:

```css
.feedback-guidance {
  margin-top: 6px;
}
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```bash
npx vitest run src/feedback/FeedbackPanel.test.tsx
```

Expected: all FeedbackPanel tests pass.

- [ ] **Step 5: Add the end-to-end assertion**

In `tests/lesson.spec.ts`, after navigating to Feedback, assert:

```ts
await expect(
  page.getByRole('note', { name: 'Teacher handoff instructions' }),
).toContainText('send the summary to Ms. Soan');
```

Keep the existing generate/copy flow unchanged.

- [ ] **Step 6: Run full automated verification**

Run:

```bash
npm test
npm run build
npm run test:e2e
```

Expected: all unit/component tests, TypeScript, Vite production build, and both Playwright journeys pass.

- [ ] **Step 7: Inspect the local feedback preview**

Open the feedback screen at 1366×768 and verify:

- Guidance sits immediately below Generate summary.
- Text is small, gray, and visually secondary.
- Guidance remains visible after generation.
- Feedback column does not overflow unexpectedly.
- Browser console has no errors or warnings.

- [ ] **Step 8: Commit the verified change**

```bash
git add src/feedback/FeedbackPanel.test.tsx src/feedback/FeedbackPanel.tsx src/data/lessonContent.ts src/types/lesson.ts src/styles.css tests/lesson.spec.ts
git commit -m "feat: add feedback handoff guidance"
```

Do not push the branch.
