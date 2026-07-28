import { BatteryLow, Meh, Smile } from 'lucide-react';
import { useState } from 'react';
import { SpeakingTimer } from '../components/SpeakingTimer';
import type { LessonContent } from '../types/lesson';

interface WelcomeStageProps {
  content: LessonContent['welcome'];
}

const moodIcons = {
  Great: Smile,
  Okay: Meh,
  Tired: BatteryLow,
};

export function WelcomeStage({ content }: WelcomeStageProps) {
  const [selectedMood, setSelectedMood] = useState<
    LessonContent['welcome']['moods'][number] | null
  >(null);

  return (
    <div className="welcome-layout">
      <div className="mood-panel">
        <p className="instruction">How are you feeling today?</p>
        <div className="choice-grid choice-grid-three">
          {content.moods.map((mood) => {
            const Icon = moodIcons[mood.label];
            return (
              <button
                className={`choice-card${selectedMood?.label === mood.label ? ' is-selected' : ''}`}
                type="button"
                key={mood.label}
                onClick={() => setSelectedMood(mood)}
                aria-pressed={selectedMood?.label === mood.label}
              >
                <Icon aria-hidden="true" />
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedMood ? (
        <div className="conversation-card reveal" aria-live="polite">
          <span className="conversation-label">Your turn to speak</span>
          <p className="main-question">{content.prompt}</p>
          <p className="follow-up">{selectedMood.followUp}</p>
          <SpeakingTimer
            seconds={content.timerSeconds}
            label={`${content.timerSeconds}-second speaking timer`}
          />
        </div>
      ) : (
        <div className="conversation-placeholder">
          <span>Choose a mood to begin the conversation.</span>
        </div>
      )}
    </div>
  );
}
