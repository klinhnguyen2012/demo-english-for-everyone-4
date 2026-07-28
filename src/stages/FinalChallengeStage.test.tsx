import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { lessonContent } from '../data/lessonContent';
import { FinalChallengeStage } from './FinalChallengeStage';

describe('FinalChallengeStage', () => {
  it('shows the 90-second challenge while keeping keywords optional', async () => {
    const user = userEvent.setup();
    render(
      <FinalChallengeStage content={lessonContent.finalChallenge} />,
    );

    expect(screen.getByLabelText('90-second speaking timer')).toBeVisible();
    expect(screen.queryByText('currently')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Show keywords' }));
    expect(screen.getByText('currently')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Record' })).toBeVisible();
  });
});
