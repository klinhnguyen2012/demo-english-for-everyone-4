import { Circle, Play, Square } from 'lucide-react';
import { useRef } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

export function AudioRecorder() {
  const recorder = useAudioRecorder();
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div className="audio-recorder">
      <button
        className="button button-outline"
        type="button"
        onClick={recorder.start}
        disabled={
          recorder.status === 'recording' ||
          recorder.status === 'requesting' ||
          recorder.status === 'unsupported'
        }
      >
        <Circle aria-hidden="true" />
        {recorder.status === 'requesting' ? 'Allow microphone…' : 'Record'}
      </button>
      <button
        className="button button-outline"
        type="button"
        onClick={recorder.stop}
        disabled={recorder.status !== 'recording'}
      >
        <Square aria-hidden="true" />
        Stop
      </button>
      <button
        className="button button-outline"
        type="button"
        onClick={() => void audioRef.current?.play()}
        disabled={!recorder.audioUrl}
      >
        <Play aria-hidden="true" />
        Replay
      </button>
      {recorder.audioUrl ? (
        <audio ref={audioRef} src={recorder.audioUrl}>
          <track kind="captions" />
        </audio>
      ) : null}
      {recorder.message ? (
        <p className="inline-status" role="status">
          {recorder.message}
        </p>
      ) : null}
    </div>
  );
}
