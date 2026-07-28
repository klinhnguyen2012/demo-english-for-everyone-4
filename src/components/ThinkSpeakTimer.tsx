import {
  ArrowRight,
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatTime } from './SpeakingTimer';

interface ThinkSpeakTimerProps {
  thinkSeconds: number;
  speakSeconds: number;
}

type TimerPhase = 'think' | 'speak' | 'complete';

const phaseLabels: Record<TimerPhase, string> = {
  think: 'Think',
  speak: 'Speak',
  complete: 'Time complete',
};

export function ThinkSpeakTimer({
  thinkSeconds,
  speakSeconds,
}: ThinkSpeakTimerProps) {
  const [phase, setPhase] = useState<TimerPhase>('think');
  const [secondsLeft, setSecondsLeft] = useState(thinkSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || phase === 'complete') {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) {
          return current - 1;
        }

        if (phase === 'think') {
          setPhase('speak');
          return speakSeconds;
        }

        setPhase('complete');
        setIsRunning(false);
        return 0;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, phase, speakSeconds]);

  const reset = () => {
    setPhase('think');
    setSecondsLeft(thinkSeconds);
    setIsRunning(false);
  };

  return (
    <div
      className={`think-speak-timer is-${phase}`}
      aria-label="Think and speak timer"
    >
      <div className="guided-timer-readout">
        <span className="guided-timer-label" aria-live="polite">
          {phaseLabels[phase]}
        </span>
        <span className="timer-value">{formatTime(secondsLeft)}</span>
      </div>

      <span className="guided-timer-track" aria-hidden="true">
        Think {Math.ceil(thinkSeconds / 60)} min
        <ArrowRight />
        Speak {Math.ceil(speakSeconds / 60)} min
      </span>

      <div className="guided-timer-controls">
        {phase === 'complete' ? (
          <CheckCircle2 className="complete-icon" aria-hidden="true" />
        ) : (
          <button
            className="icon-button"
            type="button"
            onClick={() => setIsRunning((running) => !running)}
            aria-label={
              isRunning ? `Pause ${phase} timer` : `Start ${phase} timer`
            }
          >
            {isRunning ? (
              <Pause aria-hidden="true" />
            ) : (
              <Play aria-hidden="true" />
            )}
          </button>
        )}
        <button
          className="icon-button"
          type="button"
          onClick={reset}
          aria-label="Reset think and speak timer"
        >
          <RotateCcw aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
