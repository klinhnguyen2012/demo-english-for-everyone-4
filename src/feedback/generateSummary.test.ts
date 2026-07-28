import { describe, expect, it } from 'vitest';
import { feedbackCategories } from '../data/lessonContent';
import type { FeedbackInput } from '../types/lesson';
import { generateFeedbackSummary } from './generateSummary';

const emptyFeedback: FeedbackInput = {
  ratings: {},
  strength1: '',
  strength2: '',
  nextStep: '',
  parentSummary: '',
};

describe('generateFeedbackSummary', () => {
  it('combines selected ratings and teacher comments into a parent-ready summary', () => {
    const summary = generateFeedbackSummary({
      ratings: {
        Listening: 'Strong',
        Fluency: 'Developing',
      },
      strength1: 'Explained ideas clearly.',
      strength2: 'Asked thoughtful questions.',
      nextStep: 'Use more linking phrases.',
      parentSummary: 'A confident first lesson.',
    });

    expect(summary).toContain('Listening: Strong');
    expect(summary).toContain('Fluency: Developing');
    expect(summary).toContain(
      'Strengths: Explained ideas clearly. Asked thoughtful questions.',
    );
    expect(summary).toContain('Next learning step: Use more linking phrases.');
    expect(summary).toContain('A confident first lesson.');
  });

  it('labels missing categories as not yet rated instead of guessing', () => {
    const summary = generateFeedbackSummary(emptyFeedback);

    for (const category of feedbackCategories) {
      expect(summary).toContain(`${category}: not yet rated`);
    }
  });

  it('omits empty comment sections cleanly', () => {
    const summary = generateFeedbackSummary(emptyFeedback);

    expect(summary).not.toContain('Strengths: .');
    expect(summary).not.toContain('Next learning step: .');
    expect(summary).not.toContain('Teacher note: .');
  });
});
