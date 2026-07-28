import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { lessonContent } from '../data/lessonContent';
import { SpeakingMissionStage } from './SpeakingMissionStage';

describe('SpeakingMissionStage', () => {
  it('celebrates only after all five conversation checkpoints are complete', async () => {
    const user = userEvent.setup();
    render(<SpeakingMissionStage content={lessonContent.mission} />);

    expect(screen.queryByText('Mission completed!')).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Think and speak timer'),
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Visit a science museum' }),
    );
    for (const checkpoint of lessonContent.mission.checkpoints) {
      await user.click(screen.getByRole('button', { name: checkpoint }));
    }

    expect(screen.getByText('Mission completed!')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Reach a final decision' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
