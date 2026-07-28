import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { lessonContent } from '../data/lessonContent';
import { StrongerAnswerStage } from './StrongerAnswerStage';

describe('StrongerAnswerStage', () => {
  it('reveals the answer structure one step at a time', async () => {
    const user = userEvent.setup();
    render(<StrongerAnswerStage content={lessonContent.strongerAnswer} />);

    expect(
      screen.queryByText('I think students should have less homework.'),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reveal Answer' }));
    expect(
      screen.getByText('I think students should have less homework.'),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Reveal Reason' })).toBeEnabled();
  });

  it('supports keyboard ordering and reveals the new prompt after success', async () => {
    const user = userEvent.setup();
    render(<StrongerAnswerStage content={lessonContent.strongerAnswer} />);

    for (const step of lessonContent.strongerAnswer.steps) {
      await user.click(
        screen.getByRole('button', { name: `Reveal ${step.label}` }),
      );
    }
    await user.click(screen.getByRole('button', { name: 'Move Answer up' }));
    await user.click(screen.getByRole('button', { name: 'Move Answer up' }));
    await user.click(screen.getByRole('button', { name: 'Move Example up' }));
    await user.click(screen.getByRole('button', { name: 'Check order' }));

    expect(screen.getByText('Excellent order!')).toBeVisible();
    expect(
      screen.getByText(
        'Is learning English online better than learning in a classroom?',
      ),
    ).toBeVisible();
    await user.click(
      screen.getByRole('button', { name: 'Show phrase support' }),
    );
    expect(screen.getByText('In my opinion…')).toBeVisible();
  });
});
