import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { lessonContent } from '../data/lessonContent';
import { FeedbackPanel } from './FeedbackPanel';

describe('FeedbackPanel', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('generates and copies a local teacher summary', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    render(<FeedbackPanel content={lessonContent.feedback} onRestart={vi.fn()} />);

    await user.click(screen.getByLabelText('Listening Strong'));
    await user.click(screen.getByLabelText('Fluency Developing'));
    await user.type(
      screen.getByLabelText('Strength 1'),
      'Explained ideas clearly.',
    );
    await user.type(
      screen.getByLabelText('Next learning step'),
      'Use more linking phrases.',
    );
    await user.click(
      screen.getByRole('button', { name: 'Generate summary' }),
    );

    const output = screen.getByRole('textbox', {
      name: 'Generated summary',
    });
    expect((output as HTMLTextAreaElement).value).toContain(
      'Listening: Strong',
    );
    expect((output as HTMLTextAreaElement).value).toContain(
      'Fluency: Developing',
    );

    await user.click(screen.getByRole('button', { name: 'Copy summary' }));
    expect(screen.getByText('Summary copied!')).toBeVisible();
  });

  it('prints and restarts only after confirmation', async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<FeedbackPanel content={lessonContent.feedback} onRestart={onRestart} />);

    await user.click(screen.getByRole('button', { name: 'Print feedback' }));
    expect(print).toHaveBeenCalledOnce();

    await user.click(screen.getByRole('button', { name: 'Restart lesson' }));
    expect(confirm).toHaveBeenCalledOnce();
    expect(onRestart).toHaveBeenCalledOnce();
  });
});
