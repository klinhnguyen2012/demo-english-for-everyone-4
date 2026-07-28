import { KeyRound, Mic2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { AudioRecorder } from '../components/AudioRecorder';
import { SpeakingTimer } from '../components/SpeakingTimer';
import type { LessonContent } from '../types/lesson';

interface FinalChallengeStageProps {
  content: LessonContent['finalChallenge'];
}

export function FinalChallengeStage({
  content,
}: FinalChallengeStageProps) {
  const [showKeywords, setShowKeywords] = useState(false);

  return (
    <div className="final-layout">
      <div className="final-badge">
        <Sparkles aria-hidden="true" />
        <span>Bring everything together</span>
      </div>
      <div className="final-prompt">
        <Mic2 aria-hidden="true" />
        <p className="main-question">{content.prompt}</p>
      </div>
      <div className="final-tools">
        <SpeakingTimer
          seconds={content.timerSeconds}
          label={`${content.timerSeconds}-second speaking timer`}
        />
        <AudioRecorder />
        <button
          className="button button-secondary"
          type="button"
          onClick={() => setShowKeywords((visible) => !visible)}
        >
          <KeyRound aria-hidden="true" />
          {showKeywords ? 'Hide keywords' : 'Show keywords'}
        </button>
      </div>
      {showKeywords ? (
        <div className="keyword-cloud reveal" aria-label="Keyword support">
          {content.keywords.map((keyword) => (
            <span key={keyword}>{keyword}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
