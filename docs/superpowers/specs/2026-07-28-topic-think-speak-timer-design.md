# Topic Think–Speak Timer Design

## Goal

Make the lesson timing match the teacher’s intended flow without adding timer clutter.

## Approved scope

- Keep the global lesson timer in the classroom header and change its starting duration from 25 minutes to 20 minutes.
- Remove the 20-second speaking timer from Stage 1.
- Add a guided timer only to Stage 3.
- Do not add the guided thinking cycle to Listening or Stage 6.
- Do not change the duration badges assigned to individual stages.

## Stage 3 interaction

Stage 3 will show one compact, sequential timer for the currently displayed main question or follow-up question:

1. The timer starts in a ready state showing `Think` and `2:00`.
2. The teacher starts, pauses, resumes, or resets the timer manually.
3. At the end of the thinking phase, the timer automatically moves to `Speak` and starts counting down from `1:00`.
4. At the end of the speaking phase, the timer shows that the response time is complete.
5. Selecting another topic or advancing to another follow-up question resets the timer to `Think 2:00`.

The timer will be a focused reusable component with accessible button labels and an `aria-live` status message for phase changes.

## Teacher guidance

A single instructional sentence will appear near the timer in small gray text. It is supporting copy, not a heading:

> What to do? Give the student 2 minutes to think, then 1 minute to speak. Restart for each follow-up question.

## Visual treatment

- Use a single compact timer instead of separate thinking and speaking timer cards.
- Match the existing Ami Connect blue, pale-blue, and rounded-corner visual system.
- Keep the prompt as the dominant visual element.
- Show the active phase clearly while keeping the guidance visually secondary.
- Preserve the existing Stage 3 layout at desktop and mobile widths.

## Data and component boundaries

- Store the Stage 3 guidance and phase durations in the editable lesson content data.
- Add a `ThinkSpeakTimer` component responsible only for the two-phase countdown and its controls.
- Keep question and follow-up selection in `TopicChoiceStage`.
- Use the selected topic and follow-up index to reset the timer when the displayed question changes.
- Keep the existing header countdown hook and initialize it from the updated 20-minute lesson duration.

## Testing and acceptance criteria

Automated tests must verify:

- The header begins at `20:00`.
- Stage 1 no longer renders its 20-second speaking timer.
- Stage 3 renders the small teacher guidance and starts at `Think 2:00`.
- Starting the Stage 3 timer counts down, automatically enters `Speak 1:00`, and reaches completion.
- Advancing to a follow-up question resets the timer to `Think 2:00`.
- Listening and Stage 6 do not render the guided timer.
- Existing lesson navigation and interactions still work.

The final implementation must pass the complete unit/component test suite, type checking, production build, and Playwright end-to-end tests. It must also be inspected in a local browser preview with no console errors or warnings. Nothing will be pushed to GitHub.
