import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCountdown } from './useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('counts down only while running and stops at zero', () => {
    const { result } = renderHook(() =>
      useCountdown({ initialSeconds: 2 }),
    );

    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(3000));

    expect(result.current.secondsLeft).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it('pauses and resets to the configured duration', () => {
    const { result } = renderHook(() =>
      useCountdown({ initialSeconds: 10, autoStart: true }),
    );

    act(() => vi.advanceTimersByTime(3000));
    act(() => result.current.pause());
    act(() => vi.advanceTimersByTime(3000));
    expect(result.current.secondsLeft).toBe(7);

    act(() => result.current.reset());
    expect(result.current.secondsLeft).toBe(10);
    expect(result.current.isRunning).toBe(false);
  });
});
