# Feedback Teacher Guidance Design

## Goal

Tell the teacher what to do after completing the lesson feedback form without adding a new workflow or automatic sending feature.

## Approved design

- Show one always-visible instructional sentence directly below the **Generate summary** button.
- Place it before either the initial **Print feedback** button or the generated summary card.
- Style it as small gray supporting text, not as a heading or separate card.
- Use this exact copy:

> What to do? Complete all ratings and feedback notes, click Generate summary, then copy and send the summary to Ms. Soan.

## Data and behavior

- Store the instructional copy in the editable feedback section of `lessonContent`.
- Render it through `FeedbackPanel`.
- Do not add an automatic send button, contact integration, or message submission.
- Do not disable or otherwise change the behavior of **Generate summary**.
- Keep the guidance visible before and after a summary is generated.

## Acceptance criteria

- The guidance appears immediately below **Generate summary**.
- The text is visually secondary and consistent with the small gray guidance used elsewhere in the lesson.
- Generating, copying, and printing feedback continue to work.
- Component tests, the complete test suite, the production build, and the Playwright lesson journey pass.
- The feedback layout is visually checked in the local preview without console errors or unexpected overflow.
- Nothing is pushed to GitHub.
