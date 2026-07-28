import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSpeechSynthesis } from './useSpeechSynthesis';

class UtteranceStub {
  text: string;
  rate = 1;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

describe('useSpeechSynthesis', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('speaks the supplied text at the selected playback rate', () => {
    const speak = vi.fn();
    vi.stubGlobal('SpeechSynthesisUtterance', UtteranceStub);
    vi.stubGlobal('speechSynthesis', {
      speak,
      pause: vi.fn(),
      resume: vi.fn(),
      cancel: vi.fn(),
      paused: false,
      speaking: false,
    });
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => result.current.setSpeed(1.25));
    act(() => result.current.play('Hello from Alex.'));

    const utterance = speak.mock.calls[0][0] as UtteranceStub;
    expect(utterance.text).toBe('Hello from Alex.');
    expect(utterance.rate).toBe(1.25);
    expect(result.current.status).toBe('playing');
  });

  it('cancels current speech before replaying', () => {
    const cancel = vi.fn();
    const speak = vi.fn();
    vi.stubGlobal('SpeechSynthesisUtterance', UtteranceStub);
    vi.stubGlobal('speechSynthesis', {
      speak,
      pause: vi.fn(),
      resume: vi.fn(),
      cancel,
      paused: false,
      speaking: false,
    });
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => result.current.replay('Listen again.'));

    expect(cancel).toHaveBeenCalledOnce();
    expect(speak).toHaveBeenCalledOnce();
  });
});
