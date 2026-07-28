import {
  Check,
  Clapperboard,
  FlaskConical,
  PartyPopper,
  Trophy,
  Volleyball,
} from 'lucide-react';
import { useState } from 'react';
import type { LessonContent } from '../types/lesson';

interface SpeakingMissionStageProps {
  content: LessonContent['mission'];
}

const optionIcons = [FlaskConical, Volleyball, Clapperboard];

export function SpeakingMissionStage({
  content,
}: SpeakingMissionStageProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [completed, setCompleted] = useState<boolean[]>(
    content.checkpoints.map(() => false),
  );
  const missionComplete = completed.every(Boolean);

  const toggleCheckpoint = (index: number) => {
    setCompleted((current) =>
      current.map((value, itemIndex) =>
        itemIndex === index ? !value : value,
      ),
    );
  };

  return (
    <div className="mission-layout">
      <section className="mission-main">
        <div className="scenario-card">
          <Trophy aria-hidden="true" />
          <div>
            <span className="conversation-label">Speaking mission</span>
            <p>{content.scenario}</p>
          </div>
        </div>

        <div className="mission-options">
          {content.options.map((option, index) => {
            const Icon = optionIcons[index];
            return (
              <button
                className={`mission-option${selectedOption === index ? ' is-selected' : ''}`}
                type="button"
                key={option}
                onClick={() => setSelectedOption(index)}
                aria-pressed={selectedOption === index}
              >
                <Icon aria-hidden="true" />
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        <div className="checkpoint-list" aria-label="Mission checkpoints">
          {content.checkpoints.map((checkpoint, index) => (
            <button
              className={`checkpoint${completed[index] ? 'is-complete' : ''}`}
              type="button"
              key={checkpoint}
              onClick={() => toggleCheckpoint(index)}
              aria-pressed={completed[index]}
              aria-label={checkpoint}
            >
              <span>{completed[index] ? <Check aria-hidden="true" /> : index + 1}</span>
              {checkpoint}
            </button>
          ))}
        </div>

        {missionComplete ? (
          <div className="mission-complete reveal" role="status">
            <PartyPopper aria-hidden="true" />
            <strong>{content.completionMessage}</strong>
            <i className="celebration-dot celebration-dot-one" />
            <i className="celebration-dot celebration-dot-two" />
            <i className="celebration-dot celebration-dot-three" />
          </div>
        ) : null}
      </section>

      <aside className="expression-board" aria-label="Useful expressions">
        <span className="conversation-label">Useful expressions</span>
        <div className="expression-list">
          {content.expressions.map((expression) => (
            <span key={expression}>{expression}</span>
          ))}
        </div>
      </aside>
    </div>
  );
}
