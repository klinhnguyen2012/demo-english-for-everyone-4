import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { lessonContent } from '../data/lessonContent';
import { TeacherQuestionsStage } from './TeacherQuestionsStage';

describe('TeacherQuestionsStage', () => {
  it('shows one question and gates progress through follow-up and completion', async () => {
    const user = userEvent.setup();
    render(
      <TeacherQuestionsStage content={lessonContent.teacherQuestions} />,
    );

    expect(
      screen.getByText(
        'What is something you are trying to improve at the moment?',
      ),
    ).toBeVisible();
    expect(
      screen.queryByText('What makes someone a good teacher?'),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Completed' })).toBeDisabled();

    await user.click(
      screen.getByRole('button', { name: 'Show follow-up' }),
    );
    expect(
      screen.getByText('Why is that important to you?'),
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Completed' }));

    expect(
      screen.getByText('What makes someone a good teacher?'),
    ).toBeVisible();
    expect(screen.getByText('Question 2 of 6')).toBeVisible();
  });
});
