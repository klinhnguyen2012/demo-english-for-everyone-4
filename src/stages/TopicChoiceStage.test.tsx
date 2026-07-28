import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
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
    expect(screen.queryByText('communicate')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Need some words?' }));
    expect(screen.getByText('communicate')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Next question' }));
    expect(screen.getByText('Can you give me an example?')).toBeVisible();
  });
});
