import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThinkSpeakTimer } from './ThinkSpeakTimer';

describe('ThinkSpeakTimer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('moves automatically from thinking to speaking and then completes', () => {
    render(<ThinkSpeakTimer thinkSeconds={120} speakSeconds={60} />);

    expect(screen.getByText('Think')).toBeVisible();
    expect(screen.getByText('2:00')).toBeVisible();

    fireEvent.click(
      screen.getByRole('button', { name: 'Start think timer' }),
    );
    act(() => vi.advanceTimersByTime(120_000));

    expect(screen.getByText('Speak')).toBeVisible();
    expect(screen.getByText('1:00')).toBeVisible();

    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText('Time complete')).toBeVisible();
    expect(screen.getByText('0:00')).toBeVisible();
  });

  it('can pause, resume, and reset the sequence', () => {
    render(<ThinkSpeakTimer thinkSeconds={120} speakSeconds={60} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Start think timer' }),
    );
    act(() => vi.advanceTimersByTime(5_000));
    fireEvent.click(
      screen.getByRole('button', { name: 'Pause think timer' }),
    );
    expect(screen.getByText('1:55')).toBeVisible();

    act(() => vi.advanceTimersByTime(5_000));
    expect(screen.getByText('1:55')).toBeVisible();

    fireEvent.click(
      screen.getByRole('button', { name: 'Start think timer' }),
    );
    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByText('1:54')).toBeVisible();

    fireEvent.click(
      screen.getByRole('button', { name: 'Reset think and speak timer' }),
    );
    expect(screen.getByText('Think')).toBeVisible();
    expect(screen.getByText('2:00')).toBeVisible();
  });
});
