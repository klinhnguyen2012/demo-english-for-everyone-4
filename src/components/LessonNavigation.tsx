import { ArrowLeft, ArrowRight } from 'lucide-react';

interface LessonNavigationProps {
  currentIndex: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
}

export function LessonNavigation({
  currentIndex,
  total,
  onBack,
  onNext,
}: LessonNavigationProps) {
  return (
    <footer className="lesson-navigation" aria-label="Lesson navigation">
      <button
        className="button button-secondary"
        type="button"
        onClick={onBack}
        disabled={currentIndex === 0}
      >
        <ArrowLeft aria-hidden="true" />
        Back
      </button>
      <p aria-live="polite">
        Stage {currentIndex + 1} of {total}
      </p>
      <button
        className="button button-primary"
        type="button"
        onClick={onNext}
        disabled={currentIndex === total - 1}
      >
        Next
        <ArrowRight aria-hidden="true" />
      </button>
    </footer>
  );
}
