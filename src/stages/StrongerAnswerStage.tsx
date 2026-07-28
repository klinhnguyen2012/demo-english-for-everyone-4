import {
  ArrowDown,
  ArrowUp,
  Check,
  GripVertical,
  Lightbulb,
} from 'lucide-react';
import { useState, type DragEvent } from 'react';
import type { AnswerStep, LessonContent } from '../types/lesson';

interface StrongerAnswerStageProps {
  content: LessonContent['strongerAnswer'];
}

function moveItem<T>(items: T[], from: number, to: number) {
  if (from === to || to < 0 || to >= items.length) {
    return items;
  }
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function StrongerAnswerStage({
  content,
}: StrongerAnswerStageProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [orderedSteps, setOrderedSteps] = useState<AnswerStep[]>([
    content.steps[1],
    content.steps[3],
    content.steps[0],
    content.steps[2],
  ]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [orderChecked, setOrderChecked] = useState(false);
  const [orderCorrect, setOrderCorrect] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);

  const checkOrder = () => {
    const correct = orderedSteps.every(
      (step, index) => step.label === content.steps[index].label,
    );
    setOrderCorrect(correct);
    setOrderChecked(true);
  };

  const reorder = (from: number, to: number) => {
    setOrderedSteps((steps) => moveItem(steps, from, to));
    setOrderChecked(false);
  };

  const dropAt = (event: DragEvent<HTMLLIElement>, to: number) => {
    event.preventDefault();
    if (draggedIndex !== null) {
      reorder(draggedIndex, to);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="stronger-layout">
      <section className="answer-builder" aria-label="Answer building steps">
        <p className="teaching-question">{content.teachingQuestion}</p>
        <div className="step-flow" aria-label="Answer structure">
          {content.steps.map((step, index) => (
            <button
              className={`step-card${index < revealedCount ? ' is-revealed' : ''}`}
              type="button"
              key={step.label}
              onClick={() =>
                setRevealedCount((count) => Math.max(count, index + 1))
              }
              disabled={index > revealedCount}
              aria-label={`Reveal ${step.label}`}
            >
              <span className="step-number">{index + 1}</span>
              <strong>{step.label}</strong>
              {index < revealedCount ? (
                <p className="reveal">{step.text}</p>
              ) : (
                <span className="tap-hint">
                  {index === revealedCount ? 'Click to reveal' : 'Next step'}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {revealedCount === content.steps.length ? (
      <section className="ordering-activity reveal" aria-label="Put the answer in order">
        <div className="section-intro">
          <div>
            <span className="conversation-label">Try it</span>
            <h2>Put the four parts in order</h2>
          </div>
          <span className="drag-hint">Drag or use the arrows</span>
        </div>
        <ol className="order-list">
          {orderedSteps.map((step, index) => (
            <li
              key={step.label}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => dropAt(event, index)}
            >
              <GripVertical aria-hidden="true" />
              <span className="order-position">{index + 1}</span>
              <div>
                <strong>{step.label}</strong>
                <span>{step.text}</span>
              </div>
              <span className="order-buttons">
                <button
                  className="mini-button"
                  type="button"
                  onClick={() => reorder(index, index - 1)}
                  disabled={index === 0}
                  aria-label={`Move ${step.label} up`}
                >
                  <ArrowUp aria-hidden="true" />
                </button>
                <button
                  className="mini-button"
                  type="button"
                  onClick={() => reorder(index, index + 1)}
                  disabled={index === orderedSteps.length - 1}
                  aria-label={`Move ${step.label} down`}
                >
                  <ArrowDown aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ol>
        <div className="order-check">
          <button
            className="button button-primary"
            type="button"
            onClick={checkOrder}
          >
            <Check aria-hidden="true" />
            Check order
          </button>
          {orderChecked ? (
            <p
              className={`answer-feedback ${orderCorrect ? 'is-correct' : 'is-retry'}`}
              role="status"
            >
              {orderCorrect
                ? 'Excellent order!'
                : 'Almost! Move the parts and try again.'}
            </p>
          ) : null}
        </div>
      </section>
      ) : null}

      {orderCorrect ? (
        <section className="new-speaking-prompt reveal">
          <span className="conversation-label">Now build your own answer</span>
          <p className="main-question">{content.speakingQuestion}</p>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => setShowPhrases((visible) => !visible)}
          >
            <Lightbulb aria-hidden="true" />
            {showPhrases ? 'Hide phrase support' : 'Show phrase support'}
          </button>
          {showPhrases ? (
            <div className="phrase-chips reveal">
              {content.phraseSupport.map((phrase) => (
                <span key={phrase}>{phrase}</span>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
