# Ami Connect Interactive Demo Lesson — Design Specification

## Product Goal

Create a reusable, static 25-minute English demo lesson that helps a live
teacher lead a natural conversation with a child or teenager. The student
should speak for roughly 65–70% of the lesson. The interface supports the
teacher with prompts, timers, staged reveals, listening playback, and local
feedback tools; it does not replace the teacher or assess pronunciation.

## Delivery Constraints

- Vite, React, TypeScript, clean CSS, and Lucide React icons.
- One static application with no backend, authentication, API keys, or paid
  services.
- Runs with `npm install` and `npm run dev`; builds with `npm run build`.
- Uses relative asset paths so the same build works at any GitHub Pages
  repository path.
- Includes `.github/workflows/deploy.yml` for automatic Pages deployment.
- Includes a README covering local use, GitHub push, and Pages activation.
- Uses the supplied logo unchanged at `public/assets/ami_connect_logo.jpeg`.
- Stores all editable lesson text in `src/data/lessonContent.ts`.

## Chosen Experience

The application is a single-screen guided lesson player. One stage is visible
at a time inside a 16:9 classroom canvas. A persistent header and footer keep
lesson status and navigation stable while the central activity changes. This
is preferable to a long page because it protects focus during screen sharing
and avoids exposing future answers or prompts.

The default visual style uses white surfaces, deep-blue framing, bright-blue
interactive states, light-blue supporting panels, and restrained red accents.
Typography is clear and contemporary, with generous spacing and large
conversation prompts. The result should feel friendly and youthful without
resembling a preschool worksheet.

## Application Structure

### Content

`src/data/lessonContent.ts` exports typed data for:

- lesson metadata and total duration;
- seven stage titles, durations, prompts, options, follow-ups, support phrases,
  teacher notes, and listening text;
- answer keys for the two closed listening questions;
- feedback categories and rating labels.

Components consume this data and do not embed editable lesson copy.

### UI Components

- `LessonApp`: owns current stage, global lesson state, and print/restart flow.
- `LessonHeader`: logo, stage progress, 25-minute timer, fullscreen, and teacher
  notes.
- `LessonNavigation`: Back and Next controls with keyboard navigation.
- `StageFrame`: consistent stage title, duration, and activity layout.
- Stage components: one focused component for each of the seven lesson stages.
- `SpeakingTimer`: reusable start/pause/reset countdown with completion state.
- `AudioRecorder`: optional browser-local recording with clear permission and
  unsupported-browser fallbacks.
- `FeedbackPanel`: ratings, comments, local summary generation, copy, print,
  and restart actions.

Small, stage-specific helpers may be extracted when they simplify testing or
keep responsibilities clear.

### State and Data Flow

All runtime state remains in React memory. Navigating backward preserves the
current lesson session so the teacher can revisit a stage without losing
selections. Restarting clears every stage, timer, recording URL, checkpoint,
and feedback field after teacher confirmation.

No data is transmitted. Audio recordings remain object URLs in the current
browser session and are revoked when replaced, cleared, or the app unmounts.

## Classroom Shell

The main viewport targets 1366×768 and scales down responsively. It has:

- a compact top header with the unmodified logo at left;
- eight progress positions: seven lesson stages plus feedback;
- a global 25-minute countdown with pause and reset;
- teacher notes hidden by default;
- a large central activity panel;
- Back/Next controls in a stable footer;
- a fullscreen control using the browser Fullscreen API.

Left and right arrow keys move between stages unless focus is in a form field
or an interactive control where the key has a local meaning. Navigation never
wraps beyond the first or final position. Vertical scrolling is avoided at the
target resolution; compact internal scrolling is permitted only for feedback
content.

## Stage Interactions

### 1. Welcome — 2 minutes

Show “Let’s get started!” and three mood choices. Selecting Great, Okay, or
Tired reveals “How has your day been so far?” and one deterministic follow-up
for that selection. A reusable 20-second speaking timer appears. No sample
answers are displayed.

### 2. Listening Task — 4 minutes

Browser SpeechSynthesis reads the supplied Alex passage. Controls support
play, pause/resume, replay, and 0.75×, 1×, or 1.25× speed. Starting a different
speed restarts the current reading at that rate because SpeechSynthesis does
not provide reliable cross-browser seeking. The transcript is hidden by
default.

The three questions appear sequentially:

1. Multiple choice: the student selects an option, then the teacher clicks
   “Check answer” to reveal feedback.
2. True/false: the student selects an option, then the teacher clicks
   “Check answer” to reveal feedback.
3. Open speaking prompt with a 30-second timer and optional recording.

The correct answer is never styled or exposed before the teacher checks the
student’s choice. The stage can continue if speech synthesis or microphone
recording is unavailable.

### 3. Speaking Choice — 3 minutes

Three topic cards reveal the matching speaking question. “Next question”
reveals one follow-up at a time from the supplied list. Follow-ups advance
predictably through the list so a teacher can use the same interaction in
multiple demos. “Need some words?” reveals vocabulary phrases only, never a
model response.

### 4. Build a Stronger Answer — 4 minutes

Four cards teach Answer → Reason → Example → Ask Back. Each card reveals its
model sentence only when clicked, preserving the requested step-by-step
teaching flow.

The ordering activity begins with the four labeled parts in a deliberately
mixed order. Students can reorder them by drag-and-drop or with Move Up/Move
Down buttons. “Check order” reveals success or a neutral retry message.
Completion reveals the online-versus-classroom speaking question and optional
phrase support, but no full answer.

### 5. Teacher Questions — 4 minutes

Only one main question is visible. “Show follow-up” reveals one mapped
follow-up. “Completed” records completion and advances to the next question.
The next question is inaccessible until the current one is completed. A small
question counter communicates progress without showing future questions.

### 6. Real-Life Speaking Mission — 5 minutes

Three activity cards let the pair choose an initial plan. Five clickable
checkpoints track preference, reason, response to disagreement, alternative,
and final decision. Useful expressions remain visible as phrase support, not
as a scripted conversation. The teacher note about disagreeing with the first
choice is visible only when teacher notes are enabled.

Completing all five checkpoints reveals “Mission completed!” with a brief,
subtle confetti-like CSS celebration that respects reduced-motion settings.

### 7. Final Speaking Task — 3 minutes

Show the international-club prompt, a dedicated 90-second timer with
start/pause/reset, optional browser-local recording, and hidden keyword
support. No model answer appears.

### Feedback

Six categories accept Emerging, Developing, or Strong ratings. Four text fields
capture two strengths, the next learning step, and a parent summary.

“Generate Summary” produces a concise, deterministic paragraph locally from
the selected ratings and non-empty teacher comments. Missing ratings are
described as “not yet rated” rather than guessed. The teacher can copy the
result, print a feedback-focused layout, or restart the full lesson.

## Browser Capability Handling

- SpeechSynthesis unsupported: show a short notice and keep transcript access
  available.
- Microphone unsupported or denied: show a non-blocking message and preserve
  the speaking timer and lesson navigation.
- Fullscreen unsupported or rejected: retain the normal layout and show a
  brief status message.
- Clipboard unavailable: select the generated summary and provide a concise
  manual-copy instruction.
- Media playback URLs are local only and are cleaned up to avoid leaking
  browser memory.

## Accessibility

- Semantic buttons, headings, fieldsets, labels, and status regions.
- Visible focus styles and full keyboard access.
- Text labels accompany icons.
- Color is never the only indicator of selection, correctness, or completion.
- Timers use polite live announcements only at useful milestones to avoid
  interrupting conversation.
- Drag-and-drop has keyboard controls.
- Motion is reduced when `prefers-reduced-motion` is enabled.
- Controls retain practical touch targets and readable contrast.

## Testing and Acceptance

Automated tests will cover:

- Back, Next, and arrow-key navigation;
- mood reveal and speaking timers;
- speech control wiring and transcript visibility;
- hidden listening answers and teacher-triggered feedback;
- microphone denial and unsupported MediaRecorder fallback;
- recording lifecycle with mocked browser media APIs;
- topic choice, follow-up, and vocabulary reveal;
- step-card reveal and both drag and keyboard ordering;
- gated teacher-question progression;
- mission checkpoints and completion;
- final timer and keyword reveal;
- feedback summary, copy fallback, and restart;
- fullscreen success/failure handling.

Browser verification at 1366×768 will cover every visible control, stage
navigation, timer behavior, transcript and answer privacy, drag-and-drop,
feedback generation, print styling, fullscreen, recording fallback, and
overflow. Final verification includes TypeScript checking and a production
build with no errors or TODO comments.

## Out of Scope

- Pronunciation scoring, automatic speech assessment, or AI feedback.
- Saved accounts, cloud recordings, databases, analytics, or teacher login.
- Student name, age, or level.
- Model answers for open speaking prompts.
- A full conversation script for the speaking mission.
