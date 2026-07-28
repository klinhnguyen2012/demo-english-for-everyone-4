import {
  Clipboard,
  Printer,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';
import { useRef, useState } from 'react';
import type {
  FeedbackInput,
  LessonContent,
  Rating,
} from '../types/lesson';
import { generateFeedbackSummary } from './generateSummary';

interface FeedbackPanelProps {
  content: LessonContent['feedback'];
  onRestart: () => void;
}

const initialFeedback: FeedbackInput = {
  ratings: {},
  strength1: '',
  strength2: '',
  nextStep: '',
  parentSummary: '',
};

export function FeedbackPanel({
  content,
  onRestart,
}: FeedbackPanelProps) {
  const [feedback, setFeedback] = useState<FeedbackInput>(initialFeedback);
  const [summary, setSummary] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  const setRating = (category: string, rating: Rating) => {
    setFeedback((current) => ({
      ...current,
      ratings: { ...current.ratings, [category]: rating },
    }));
  };

  const updateField = (
    field: keyof Omit<FeedbackInput, 'ratings'>,
    value: string,
  ) => {
    setFeedback((current) => ({ ...current, [field]: value }));
  };

  const generate = () => {
    setSummary(generateFeedbackSummary(feedback));
    setCopyStatus('');
  };

  const copySummary = async () => {
    if (!summary) {
      return;
    }
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard unavailable');
      }
      await navigator.clipboard.writeText(summary);
      setCopyStatus('Summary copied!');
    } catch {
      summaryRef.current?.focus();
      summaryRef.current?.select();
      setCopyStatus('Summary selected — press Ctrl+C or Command+C to copy.');
    }
  };

  const restart = () => {
    if (
      window.confirm(
        'Restart the lesson? All selections, recordings and feedback will be cleared.',
      )
    ) {
      onRestart();
    }
  };

  return (
    <div className="feedback-layout">
      <section className="ratings-panel" aria-label="Lesson ratings">
        <div className="section-intro">
          <div>
            <span className="conversation-label">Quick rating</span>
            <h2>How did today’s conversation go?</h2>
          </div>
        </div>
        <div className="rating-table">
          {content.categories.map((category) => (
            <fieldset key={category}>
              <legend>{category}</legend>
              <div className="rating-options">
                {content.ratings.map((rating) => (
                  <label
                    key={rating}
                    className={
                      feedback.ratings[category] === rating
                        ? 'is-selected'
                        : ''
                    }
                  >
                    <input
                      type="radio"
                      name={category}
                      value={rating}
                      checked={feedback.ratings[category] === rating}
                      onChange={() => setRating(category, rating)}
                      aria-label={`${category} ${rating}`}
                    />
                    <span>{rating}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <section className="feedback-notes" aria-label="Teacher feedback notes">
        <div className="feedback-fields">
          <label>
            <span>Strength 1</span>
            <textarea
              value={feedback.strength1}
              onChange={(event) =>
                updateField('strength1', event.target.value)
              }
              placeholder="A specific success from today"
            />
          </label>
          <label>
            <span>Strength 2</span>
            <textarea
              value={feedback.strength2}
              onChange={(event) =>
                updateField('strength2', event.target.value)
              }
              placeholder="Another positive observation"
            />
          </label>
          <label>
            <span>Next learning step</span>
            <textarea
              value={feedback.nextStep}
              onChange={(event) =>
                updateField('nextStep', event.target.value)
              }
              placeholder="One clear focus for the next lesson"
            />
          </label>
          <label>
            <span>Parent summary</span>
            <textarea
              value={feedback.parentSummary}
              onChange={(event) =>
                updateField('parentSummary', event.target.value)
              }
              placeholder="A warm, concise overview"
            />
          </label>
        </div>

        <button
          className="button button-primary generate-button"
          type="button"
          onClick={generate}
        >
          <Sparkles aria-hidden="true" />
          Generate summary
        </button>
        <p
          className="teacher-guidance feedback-guidance"
          role="note"
          aria-label="Teacher handoff instructions"
        >
          {content.guidance}
        </p>

        {summary ? (
          <div className="summary-card reveal">
            <label>
              <span>Generated summary</span>
              <textarea
                ref={summaryRef}
                value={summary}
                readOnly
                aria-label="Generated summary"
              />
            </label>
            <div className="summary-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={copySummary}
              >
                <Clipboard aria-hidden="true" />
                Copy summary
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => window.print()}
              >
                <Printer aria-hidden="true" />
                Print feedback
              </button>
            </div>
            {copyStatus ? (
              <p className="inline-status" role="status">
                {copyStatus}
              </p>
            ) : null}
          </div>
        ) : (
          <button
            className="button button-secondary print-without-summary"
            type="button"
            onClick={() => window.print()}
          >
            <Printer aria-hidden="true" />
            Print feedback
          </button>
        )}

        <button
          className="restart-button"
          type="button"
          onClick={restart}
        >
          <RefreshCcw aria-hidden="true" />
          Restart lesson
        </button>
      </section>
    </div>
  );
}
