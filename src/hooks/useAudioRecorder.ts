import { useCallback, useEffect, useRef, useState } from 'react';

type RecorderStatus =
  | 'idle'
  | 'requesting'
  | 'recording'
  | 'ready'
  | 'error'
  | 'unsupported';

export function useAudioRecorder() {
  const supported =
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== 'undefined';
  const [status, setStatus] = useState<RecorderStatus>(
    supported ? 'idle' : 'unsupported',
  );
  const [message, setMessage] = useState(
    supported ? '' : 'Audio recording is not available in this browser.',
  );
  const [audioUrl, setAudioUrl] = useState('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const urlRef = useRef('');
  const mountedRef = useRef(true);

  const clearUrl = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = '';
    }
    setAudioUrl('');
  }, []);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (recorderRef.current?.state === 'recording') {
        recorderRef.current.ondataavailable = null;
        recorderRef.current.onstop = null;
        recorderRef.current.stop();
      }
      stopTracks();
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
    };
  }, [stopTracks]);

  const start = useCallback(async () => {
    if (!supported) {
      setStatus('unsupported');
      setMessage('Audio recording is not available in this browser.');
      return;
    }

    setStatus('requesting');
    setMessage('');
    clearUrl();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        const nextUrl = URL.createObjectURL(blob);
        if (!mountedRef.current) {
          URL.revokeObjectURL(nextUrl);
          stopTracks();
          return;
        }
        urlRef.current = nextUrl;
        setAudioUrl(nextUrl);
        setStatus('ready');
        setMessage('Recording ready to replay.');
        stopTracks();
      };
      recorder.start();
      setStatus('recording');
    } catch (error) {
      stopTracks();
      setStatus('error');
      setMessage(
        error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'Microphone access was not allowed. You can continue without recording.'
          : 'Recording could not start. You can continue without it.',
      );
    }
  }, [clearUrl, stopTracks, supported]);

  const stop = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop();
    }
  }, []);

  return { status, message, audioUrl, start, stop };
}
