import { CheckCircle2, MessageCircleQuestion, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { LessonContent } from '../types/lesson';

interface TeacherQuestionsStageProps {
  content: LessonContent['teacherQuestions'];
}

export function TeacherQuestionsStage({
  content,
}: TeacherQuestionsStageProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [followUpVisible, setFollowUpVisible] = useState(false);
  const [finished, setFinished] = useState(false);

  const completeQuestion = () => {
    if (questionIndex === content.questions.length - 1) {
      setFinished(true);
      return;
    }
    setQuestionIndex((index) => index + 1);
    setFollowUpVisible(false);
  };

  if (finished) {
    return (
      <div className="completion-panel reveal">
        <Sparkles aria-hidden="true" />
        <span className="conversation-label">Conversation complete</span>
        <p>You explored six ideas and kept the conversation moving.</p>
      </div>
    );
  }

  return (
    <div className="teacher-question-layout">
      <div className="question-progress">
        <span>
          Question {questionIndex + 1} of {content.questions.length}
        </span>
        <div className="dot-progress" aria-hidden="true">
          {content.questions.map((question, index) => (
            <i
              key={question}
              className={
                index < questionIndex
                  ? 'is-complete'
                  : index === questionIndex
                    ? 'is-current'
                    : ''
              }
            />
          ))}
        </div>
      </div>

      <div className="teacher-question-card reveal" key={questionIndex}>
        <MessageCircleQuestion aria-hidden="true" />
        <span className="conversation-label">Teacher asks</span>
        <p className="main-question">
          {content.questions[questionIndex]}
        </p>
        {followUpVisible ? (
          <div className="follow-up-box reveal">
            <span>Follow-up</span>
            <p>{content.followUps[questionIndex]}</p>
          </div>
        ) : null}
      </div>

      <div className="teacher-question-actions">
        <button
          className="button button-secondary"
          type="button"
          onClick={() => setFollowUpVisible(true)}
          disabled={followUpVisible}
        >
          Show follow-up
        </button>
        <button
          className="button button-primary"
          type="button"
          onClick={completeQuestion}
          disabled={!followUpVisible}
        >
          <CheckCircle2 aria-hidden="true" />
          Completed
        </button>
      </div>
    </div>
  );
}
