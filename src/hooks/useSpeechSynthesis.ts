import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechStatus = 'idle' | 'playing' | 'paused' | 'error';
type SpeechSpeed = 0.75 | 1 | 1.25;

export function useSpeechSynthesis() {
  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window;
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [speed, setSpeedState] = useState<SpeechSpeed>(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (isSupported && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setStatus('idle');
  }, [isSupported]);

  useEffect(() => stop, [stop]);

  const play = useCallback(
    (text: string) => {
      if (!isSupported) {
        setStatus('error');
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speed;
      utterance.onend = () => setStatus('idle');
      utterance.onerror = () => setStatus('error');
      utteranceRef.current = utterance;
      window.speechSynthesis?.speak(utterance);
      setStatus('playing');
    },
    [isSupported, speed],
  );

  const togglePause = useCallback(() => {
    if (!isSupported) {
      return;
    }
    if (status === 'playing') {
      window.speechSynthesis?.pause();
      setStatus('paused');
    } else if (status === 'paused') {
      window.speechSynthesis?.resume();
      setStatus('playing');
    }
  }, [isSupported, status]);

  const replay = useCallback(
    (text: string) => {
      if (isSupported && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      play(text);
    },
    [isSupported, play],
  );

  const setSpeed = useCallback(
    (nextSpeed: SpeechSpeed) => {
      if (status !== 'idle') {
        stop();
      }
      setSpeedState(nextSpeed);
    },
    [status, stop],
  );

  return {
    isSupported,
    status,
    speed,
    play,
    togglePause,
    replay,
    setSpeed,
    stop,
  };
}
