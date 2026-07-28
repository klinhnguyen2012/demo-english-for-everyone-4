import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { lessonContent } from '../data/lessonContent';
import { ListeningStage } from './ListeningStage';

class UtteranceStub {
  rate = 1;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public text: string) {}
}

describe('ListeningStage', () => {
  beforeEach(() => {
    vi.stubGlobal('SpeechSynthesisUtterance', UtteranceStub);
    vi.stubGlobal('speechSynthesis', {
      speak: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      cancel: vi.fn(),
      paused: false,
      speaking: false,
    });
  });

  it('keeps the transcript hidden until requested', async () => {
    const user = userEvent.setup();
    render(<ListeningStage content={lessonContent.listening} />);

    expect(
      screen.queryByText(lessonContent.listening.passage),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Think and speak timer'),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Show transcript' }));
    expect(screen.getByText(lessonContent.listening.passage)).toBeVisible();
  });

  it('reveals closed-question feedback only after the teacher checks it', async () => {
    const user = userEvent.setup();
    render(<ListeningStage content={lessonContent.listening} />);

    await user.click(
      screen.getByLabelText('He did not know anyone at the new school.'),
    );
    expect(screen.queryByText('That’s correct.')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(screen.getByText('That’s correct.')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Next question' }));
    expect(
      screen.getByText('Alex practises basketball every day.'),
    ).toBeVisible();
    await user.click(screen.getByLabelText('False'));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    await user.click(screen.getByRole('button', { name: 'Next question' }));

    expect(
      screen.getByText(
        'Have you ever felt nervous when meeting new people? What happened?',
      ),
    ).toBeVisible();
    expect(screen.getByLabelText('30-second speaking timer')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Record' })).toBeVisible();
  });
});
