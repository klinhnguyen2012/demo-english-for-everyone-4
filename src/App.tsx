import { useCallback, useEffect, useState } from 'react';
import { ClassroomHeader } from './components/ClassroomHeader';
import { LessonNavigation } from './components/LessonNavigation';
import { StageFrame } from './components/StageFrame';
import { lessonContent, lessonStages } from './data/lessonContent';
import { FeedbackPanel } from './feedback/FeedbackPanel';
import { useCountdown } from './hooks/useCountdown';
import { ListeningStage } from './stages/ListeningStage';
import { FinalChallengeStage } from './stages/FinalChallengeStage';
import { SpeakingMissionStage } from './stages/SpeakingMissionStage';
import { StrongerAnswerStage } from './stages/StrongerAnswerStage';
import { TeacherQuestionsStage } from './stages/TeacherQuestionsStage';
import { TopicChoiceStage } from './stages/TopicChoiceStage';
import { WelcomeStage } from './stages/WelcomeStage';

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
  const [sessionKey, setSessionKey] = useState(0);
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

  const restartLesson = () => {
    setCurrentIndex(0);
    setNotesOpen(false);
    setFullscreenMessage('');
    lessonTimer.reset();
    setSessionKey((key) => key + 1);
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

        <div className="activity-area" key={sessionKey}>
          {lessonStages.map((stage, index) => (
            <StageFrame
              key={stage.title}
              title={stage.title}
              duration={stage.duration}
              eyebrow={`Stage ${index + 1}`}
              hidden={currentIndex !== index}
            >
              {index === 0 ? (
                <WelcomeStage content={lessonContent.welcome} />
              ) : null}
              {index === 1 ? (
                <ListeningStage content={lessonContent.listening} />
              ) : null}
              {index === 2 ? (
                <TopicChoiceStage content={lessonContent.topicChoice} />
              ) : null}
              {index === 3 ? (
                <StrongerAnswerStage content={lessonContent.strongerAnswer} />
              ) : null}
              {index === 4 ? (
                <TeacherQuestionsStage
                  content={lessonContent.teacherQuestions}
                />
              ) : null}
              {index === 5 ? (
                <SpeakingMissionStage content={lessonContent.mission} />
              ) : null}
              {index === 6 ? (
                <FinalChallengeStage
                  content={lessonContent.finalChallenge}
                />
              ) : null}
            </StageFrame>
          ))}
          <StageFrame
            title={lessonContent.feedback.title}
            eyebrow="Feedback"
            hidden={currentIndex !== totalScreens - 1}
          >
            <FeedbackPanel
              content={lessonContent.feedback}
              onRestart={restartLesson}
            />
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
