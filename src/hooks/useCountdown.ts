import { useCallback, useEffect, useRef, useState } from 'react';

interface CountdownOptions {
  initialSeconds: number;
  autoStart?: boolean;
}

interface CountdownController {
  secondsLeft: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useCountdown({
  initialSeconds,
  autoStart = false,
}: CountdownOptions): CountdownController {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const initialSecondsRef = useRef(initialSeconds);

  useEffect(() => {
    initialSecondsRef.current = initialSeconds;
    setSecondsLeft(initialSeconds);
    setIsRunning(autoStart);
  }, [autoStart, initialSeconds]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  const start = useCallback(() => {
    setSecondsLeft((current) =>
      current === 0 ? initialSecondsRef.current : current,
    );
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setSecondsLeft(initialSecondsRef.current);
    setIsRunning(false);
  }, []);

  return { secondsLeft, isRunning, start, pause, reset };
}
