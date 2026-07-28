import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { lessonContent } from '../data/lessonContent';
import { WelcomeStage } from './WelcomeStage';

describe('WelcomeStage', () => {
  it('reveals a conversation prompt only after a mood is selected', async () => {
    const user = userEvent.setup();
    render(<WelcomeStage content={lessonContent.welcome} />);

    expect(
      screen.queryByText('How has your day been so far?'),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Great' }));

    expect(screen.getByText('How has your day been so far?')).toBeVisible();
    expect(
      screen.getByText('What was the best part of your day?'),
    ).toBeVisible();
    expect(screen.getByLabelText('20-second speaking timer')).toBeVisible();
  });
});
