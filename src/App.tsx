import { useCallback, useEffect, useState } from 'react';
import { ClassroomHeader } from './components/ClassroomHeader';
import { LessonNavigation } from './components/LessonNavigation';
import { StageFrame } from './components/StageFrame';
import { lessonContent, lessonStages } from './data/lessonContent';
import { useCountdown } from './hooks/useCountdown';

const totalScreens = lessonStages.length + 1;

function isTextInput(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenMessage, setFullscreenMessage] = useState('');
  const lessonTimer = useCountdown({
    initialSeconds: lessonContent.totalMinutes * 60,
    autoStart: true,
  });

  const moveBack = useCallback(
    () => setCurrentIndex((current) => Math.max(0, current - 1)),
    [],
  );
  const moveNext = useCallback(
    () =>
      setCurrentIndex((current) => Math.min(totalScreens - 1, current + 1)),
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTextInput(event.target)) {
        return;
      }
      if (event.key === 'ArrowLeft') {
        moveBack();
      }
      if (event.key === 'ArrowRight') {
        moveNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveBack, moveNext]);

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  const toggleFullscreen = async () => {
    setFullscreenMessage('');
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        setFullscreenMessage('Fullscreen is not available in this browser.');
      }
    } catch {
      setFullscreenMessage('Fullscreen could not be opened. The lesson can continue normally.');
    }
  };

  return (
    <main className="app-shell">
      <div className="classroom">
        <ClassroomHeader
          currentIndex={currentIndex}
          total={totalScreens}
          timer={lessonTimer}
          notesOpen={notesOpen}
          onToggleNotes={() => setNotesOpen((open) => !open)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />

        {notesOpen ? (
          <aside className="teacher-note" aria-label="Teacher notes">
            <strong>Teacher note</strong>
            <span>{lessonContent.teacherNotes[currentIndex]}</span>
          </aside>
        ) : null}

        {fullscreenMessage ? (
          <p className="status-message" role="status">
            {fullscreenMessage}
          </p>
        ) : null}

        <div className="activity-area">
          {lessonStages.map((stage, index) => (
            <StageFrame
              key={stage.title}
              title={stage.title}
              duration={stage.duration}
              eyebrow={`Stage ${index + 1}`}
              hidden={currentIndex !== index}
            >
              {index === 1 ? (
                <label>
                  Playback speed
                  <select aria-label="Playback speed" defaultValue="1">
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                  </select>
                </label>
              ) : (
                <p className="prompt-card">Let’s begin this conversation.</p>
              )}
            </StageFrame>
          ))}
          <StageFrame
            title={lessonContent.feedback.title}
            eyebrow="Feedback"
            hidden={currentIndex !== totalScreens - 1}
          >
            <p className="prompt-card">Review today’s conversation.</p>
          </StageFrame>
        </div>

        <LessonNavigation
          currentIndex={currentIndex}
          total={totalScreens}
          onBack={moveBack}
          onNext={moveNext}
        />
      </div>
    </main>
  );
}
