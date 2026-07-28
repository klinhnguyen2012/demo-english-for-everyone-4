import {
  Expand,
  Minimize,
  NotebookTabs,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { formatTime } from './SpeakingTimer';

interface ClassroomHeaderProps {
  currentIndex: number;
  total: number;
  timer: {
    secondsLeft: number;
    isRunning: boolean;
    start: () => void;
    pause: () => void;
    reset: () => void;
  };
  notesOpen: boolean;
  onToggleNotes: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function ClassroomHeader({
  currentIndex,
  total,
  timer,
  notesOpen,
  onToggleNotes,
  isFullscreen,
  onToggleFullscreen,
}: ClassroomHeaderProps) {
  return (
    <header className="classroom-header">
      <div className="brand-lockup">
        <img src="./assets/ami_connect_logo.jpeg" alt="Ami Connect" />
        <div>
          <strong>English Demo</strong>
          <span>Speak • Listen • Connect</span>
        </div>
      </div>

      <div className="lesson-progress">
        <div className="progress-copy">
          <span>
            Stage {currentIndex + 1} of {total}
          </span>
          <span>{Math.round(((currentIndex + 1) / total) * 100)}%</span>
        </div>
        <progress
          max={total}
          value={currentIndex + 1}
          aria-label="Lesson progress"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={currentIndex + 1}
        />
      </div>

      <div className="header-actions">
        <div className="lesson-timer" aria-label="25-minute lesson timer">
          <span className="timer-value">{formatTime(timer.secondsLeft)}</span>
          <button
            className="icon-button"
            type="button"
            onClick={timer.isRunning ? timer.pause : timer.start}
            aria-label={
              timer.isRunning ? 'Pause lesson timer' : 'Resume lesson timer'
            }
          >
            {timer.isRunning ? (
              <Pause aria-hidden="true" />
            ) : (
              <Play aria-hidden="true" />
            )}
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={timer.reset}
            aria-label="Reset lesson timer"
          >
            <RotateCcw aria-hidden="true" />
          </button>
        </div>
        <button
          className={`tool-button${notesOpen ? ' is-active' : ''}`}
          type="button"
          onClick={onToggleNotes}
          aria-expanded={notesOpen}
          aria-label={notesOpen ? 'Hide teacher notes' : 'Show teacher notes'}
        >
          <NotebookTabs aria-hidden="true" />
          <span>Notes</span>
        </button>
        <button
          className="tool-button"
          type="button"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <Minimize aria-hidden="true" />
          ) : (
            <Expand aria-hidden="true" />
          )}
          <span>Fullscreen</span>
        </button>
      </div>
    </header>
  );
}
