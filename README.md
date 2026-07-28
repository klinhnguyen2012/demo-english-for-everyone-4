# Demo-English-for-Everyone-4

A complete, reusable 25-minute English demo lesson for a live Ami Connect
teacher. The lesson prioritises speaking, listening, reasons, examples,
follow-up questions, and natural responses to another person’s opinion.

Everything runs in the browser. There is no login, backend, database, API key,
or paid service. Speech playback uses the browser’s built-in
`SpeechSynthesis`; optional recordings use `MediaRecorder` and stay in the
current browser session.

## What is included

- Seven guided lesson stages and a teacher feedback screen
- 25-minute lesson timer plus stage speaking timers
- Browser speech playback with speed controls and hidden transcript
- Teacher-gated listening answers
- Optional local audio recording and replay
- Keyboard-accessible drag-and-drop ordering activity
- Conversation checkpoints and a subtle mission celebration
- Locally generated, printable parent feedback summary
- Fullscreen mode, teacher notes, arrow-key navigation, and responsive layout
- Automatic GitHub Pages workflow

All lesson prompts, questions, answers, vocabulary, teacher notes, and feedback
labels live in `src/data/lessonContent.ts`.

## Run locally

Requirements: Node.js 22 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

Useful commands:

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

The production site is created in `dist/`. Vite uses a relative base path, so
the same build works for both a GitHub user site and a repository Pages site.

## Project structure

```text
.
├── .github/workflows/deploy.yml
├── public/assets/ami_connect_logo.jpeg
├── src
│   ├── components
│   ├── data/lessonContent.ts
│   ├── feedback
│   ├── hooks
│   ├── stages
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── tests
├── index.html
├── package.json
└── vite.config.ts
```

## Push the project to GitHub

Create an empty GitHub repository without adding a README or `.gitignore`.
From this project folder, run:

```bash
git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git
git push -u origin main
```

Replace `YOUR-ACCOUNT` and `YOUR-REPOSITORY` with the real values. Do not run
`git init` again; this project is already a Git repository.

## Enable GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Open the **Actions** tab and wait for “Deploy Ami Connect lesson to GitHub
   Pages” to finish.
5. Return to **Settings → Pages** to find the published URL.

Every later push to `main` runs the unit tests, builds the site, and publishes
the resulting `dist/` folder automatically. The workflow can also be started
manually from the Actions tab.

## Browser notes

- Speech voices differ by operating system and browser.
- If microphone permission is denied, recording is disabled but the lesson
  continues normally.
- Recordings are never uploaded and disappear when the page is refreshed or
  the lesson is restarted.
- Printing from the feedback screen uses a feedback-focused print layout.
