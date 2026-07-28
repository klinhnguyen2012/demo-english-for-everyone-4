import {
  Eye,
  EyeOff,
  Headphones,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useState } from 'react';
import { AudioRecorder } from '../components/AudioRecorder';
import { SpeakingTimer } from '../components/SpeakingTimer';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import type { ChoiceQuestion, LessonContent } from '../types/lesson';

interface ListeningStageProps {
  content: LessonContent['listening'];
}

interface ClosedQuestionProps {
  question: ChoiceQuestion;
  questionNumber: number;
  onNext: () => void;
}

function ClosedQuestion({
  question,
  questionNumber,
  onNext,
}: ClosedQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const isCorrect = selected === question.correctIndex;

  return (
    <div className="question-panel">
      <span className="question-counter">Question {questionNumber} of 3</span>
      <fieldset>
        <legend className="main-question">{question.prompt}</legend>
        <div className="answer-list">
          {question.options.map((option, index) => (
            <label
              className={`answer-option${selected === index ? ' is-selected' : ''}`}
              key={option}
            >
              <input
                type="radio"
                name={`question-${questionNumber}`}
                checked={selected === index}
                onChange={() => {
                  setSelected(index);
                  setChecked(false);
                }}
                aria-label={option}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="question-actions">
        <button
          className="button button-primary"
          type="button"
          disabled={selected === null}
          onClick={() => setChecked(true)}
        >
          Check answer
        </button>
        {checked ? (
          <>
            <p
              className={`answer-feedback ${isCorrect ? 'is-correct' : 'is-retry'}`}
              role="status"
            >
              {isCorrect
                ? 'That’s correct.'
                : `Not quite. The correct answer is: ${question.options[question.correctIndex]}`}
            </p>
            <button
              className="button button-secondary"
              type="button"
              onClick={onNext}
            >
              Next question
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function ListeningStage({ content }: ListeningStageProps) {
  const speech = useSpeechSynthesis();
  const [showTranscript, setShowTranscript] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  return (
    <div className="listening-layout">
      <div className="audio-panel">
        <div className="audio-orb" aria-hidden="true">
          <Headphones />
          <span />
          <span />
          <span />
        </div>
        <div className="audio-controls" aria-label="Listening controls">
          <button
            className="button button-primary"
            type="button"
            onClick={() => speech.play(content.passage)}
            disabled={!speech.isSupported || speech.status === 'playing'}
          >
            <Play aria-hidden="true" />
            Play
          </button>
          <button
            className="button button-outline"
            type="button"
            onClick={speech.togglePause}
            disabled={
              speech.status !== 'playing' && speech.status !== 'paused'
            }
          >
            <Pause aria-hidden="true" />
            {speech.status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button
            className="button button-outline"
            type="button"
            onClick={() => speech.replay(content.passage)}
            disabled={!speech.isSupported}
          >
            <RotateCcw aria-hidden="true" />
            Replay
          </button>
          <label className="speed-control">
            <span>Playback speed</span>
            <select
              aria-label="Playback speed"
              value={speech.speed}
              onChange={(event) =>
                speech.setSpeed(Number(event.target.value) as 0.75 | 1 | 1.25)
              }
            >
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
            </select>
          </label>
        </div>
        {!speech.isSupported ? (
          <p className="inline-status" role="status">
            Browser voice playback is not available. You can show the
            transcript and continue.
          </p>
        ) : null}
        <button
          className="transcript-toggle"
          type="button"
          onClick={() => setShowTranscript((visible) => !visible)}
        >
          {showTranscript ? (
            <EyeOff aria-hidden="true" />
          ) : (
            <Eye aria-hidden="true" />
          )}
          {showTranscript ? 'Hide transcript' : 'Show transcript'}
        </button>
        {showTranscript ? (
          <p className="transcript reveal">{content.passage}</p>
        ) : null}
      </div>

      <div className="listening-question">
        {questionIndex === 0 ? (
          <ClosedQuestion
            key="question-one"
            question={content.firstQuestion}
            questionNumber={1}
            onNext={() => setQuestionIndex(1)}
          />
        ) : null}
        {questionIndex === 1 ? (
          <ClosedQuestion
            key="question-two"
            question={content.secondQuestion}
            questionNumber={2}
            onNext={() => setQuestionIndex(2)}
          />
        ) : null}
        {questionIndex === 2 ? (
          <div className="question-panel reveal">
            <span className="question-counter">Question 3 of 3</span>
            <p className="main-question">{content.speakingQuestion}</p>
            <div className="speaking-tools">
              <SpeakingTimer
                seconds={content.speakingTimerSeconds}
                label={`${content.speakingTimerSeconds}-second speaking timer`}
              />
              <AudioRecorder />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
