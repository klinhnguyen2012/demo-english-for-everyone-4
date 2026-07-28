import { feedbackCategories } from '../data/lessonContent';
import type { FeedbackInput } from '../types/lesson';

export function generateFeedbackSummary(input: FeedbackInput): string {
  const ratings = feedbackCategories
    .map(
      (category) =>
        `${category}: ${input.ratings[category] ?? 'not yet rated'}`,
    )
    .join('; ');

  const sections = [`Lesson ratings — ${ratings}.`];
  const strengths = [input.strength1, input.strength2]
    .map((value) => value.trim())
    .filter(Boolean);

  if (strengths.length > 0) {
    sections.push(`Strengths: ${strengths.join(' ')}`);
  }

  if (input.nextStep.trim()) {
    sections.push(`Next learning step: ${input.nextStep.trim()}`);
  }

  if (input.parentSummary.trim()) {
    sections.push(`Teacher note: ${input.parentSummary.trim()}`);
  }

  return sections.join('\n\n');
}
