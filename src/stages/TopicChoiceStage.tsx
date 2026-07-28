import { BookOpen, Gamepad2, Laptop, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import type { LessonContent } from '../types/lesson';

interface TopicChoiceStageProps {
  content: LessonContent['topicChoice'];
}

const topicIcons = [BookOpen, Laptop, Gamepad2];

export function TopicChoiceStage({ content }: TopicChoiceStageProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showWords, setShowWords] = useState(false);
  const [followUpIndex, setFollowUpIndex] = useState<number | null>(null);
  const selectedTopic =
    selectedIndex === null ? null : content.topics[selectedIndex];

  const selectTopic = (index: number) => {
    setSelectedIndex(index);
    setShowWords(false);
    setFollowUpIndex(null);
  };

  return (
    <div className="topic-layout">
      <div className="topic-picker">
        <p className="instruction">Pick one topic that interests you.</p>
        <div className="choice-grid choice-grid-three">
          {content.topics.map((topic, index) => {
            const Icon = topicIcons[index];
            return (
              <button
                className={`choice-card topic-card${selectedIndex === index ? ' is-selected' : ''}`}
                type="button"
                key={topic.title}
                onClick={() => selectTopic(index)}
                aria-pressed={selectedIndex === index}
              >
                <Icon aria-hidden="true" />
                <span>{topic.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedTopic ? (
        <div className="conversation-card topic-conversation reveal">
          <span className="conversation-label">Your turn to speak</span>
          <p className="main-question">{selectedTopic.prompt}</p>
          {followUpIndex !== null ? (
            <p className="follow-up">
              <span>Follow-up</span>
              {content.followUps[followUpIndex]}
            </p>
          ) : null}
          <div className="support-actions">
            <button
              className="button button-secondary"
              type="button"
              onClick={() => setShowWords((visible) => !visible)}
            >
              <Lightbulb aria-hidden="true" />
              {showWords ? 'Hide words' : 'Need some words?'}
            </button>
            <button
              className="button button-primary"
              type="button"
              onClick={() =>
                setFollowUpIndex((index) =>
                  index === null
                    ? 0
                    : (index + 1) % content.followUps.length,
                )
              }
            >
              Next question
            </button>
          </div>
          {showWords ? (
            <div className="phrase-chips reveal" aria-label="Vocabulary support">
              {selectedTopic.vocabulary.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="conversation-placeholder">
          <span>Your question will appear here.</span>
        </div>
      )}
    </div>
  );
}
