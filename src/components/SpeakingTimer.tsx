import { Pause, Play, RotateCcw } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';

interface SpeakingTimerProps {
  seconds: number;
  label?: string;
}

export function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function SpeakingTimer({
  seconds,
  label = 'Speaking timer',
}: SpeakingTimerProps) {
  const timer = useCountdown({ initialSeconds: seconds });

  return (
    <div className="speaking-timer" aria-label={label}>
      <span className="timer-value" aria-live="polite">
        {formatTime(timer.secondsLeft)}
      </span>
      <button
        className="icon-button"
        type="button"
        onClick={timer.isRunning ? timer.pause : timer.start}
        aria-label={timer.isRunning ? `Pause ${label}` : `Start ${label}`}
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
        aria-label={`Reset ${label}`}
      >
        <RotateCcw aria-hidden="true" />
      </button>
    </div>
  );
}
