import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { lessonContent } from '../data/lessonContent';
import { TopicChoiceStage } from './TopicChoiceStage';

describe('TopicChoiceStage', () => {
  it('shows the selected question, then optional follow-up and vocabulary', async () => {
    const user = userEvent.setup();
    render(<TopicChoiceStage content={lessonContent.topicChoice} />);

    await user.click(screen.getByRole('button', { name: 'Technology' }));
    expect(
      screen.getByText('How does technology make your daily life easier?'),
    ).toBeVisible();
    expect(
      screen.getByText(
        'What to do? Give the student 2 minutes to think, then 1 minute to speak. Restart for each follow-up question.',
      ),
    ).toBeVisible();
    expect(screen.getByLabelText('Think and speak timer')).toHaveTextContent(
      /Think\s*2:00/,
    );
    expect(screen.queryByText('communicate')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Need some words?' }));
    expect(screen.getByText('communicate')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Next question' }));
    expect(screen.getByText('Can you give me an example?')).toBeVisible();
    expect(screen.getByLabelText('Think and speak timer')).toHaveTextContent(
      /Think\s*2:00/,
    );
  });

  it('resets the guided timer when the displayed question changes', () => {
    vi.useFakeTimers();

    try {
      render(<TopicChoiceStage content={lessonContent.topicChoice} />);

      fireEvent.click(screen.getByRole('button', { name: 'Technology' }));
      fireEvent.click(
        screen.getByRole('button', { name: 'Start think timer' }),
      );
      act(() => vi.advanceTimersByTime(5_000));
      expect(screen.getByLabelText('Think and speak timer')).toHaveTextContent(
        '1:55',
      );

      fireEvent.click(screen.getByRole('button', { name: 'Next question' }));
      expect(screen.getByLabelText('Think and speak timer')).toHaveTextContent(
        /Think\s*2:00/,
      );

      fireEvent.click(screen.getByRole('button', { name: 'School life' }));
      expect(screen.getByLabelText('Think and speak timer')).toHaveTextContent(
        /Think\s*2:00/,
      );
    } finally {
      vi.useRealTimers();
    }
  });
});
