import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAudioRecorder } from './useAudioRecorder';

describe('useAudioRecorder', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports a non-blocking message when microphone access is denied', async () => {
    const getUserMedia = vi
      .fn()
      .mockRejectedValue(new DOMException('Denied', 'NotAllowedError'));
    vi.stubGlobal('MediaRecorder', class {});
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia },
    });
    const { result } = renderHook(() => useAudioRecorder());

    await act(() => result.current.start());

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.message).toMatch(/microphone access was not allowed/i);
  });

  it('stays usable when recording is unsupported', () => {
    vi.stubGlobal('MediaRecorder', undefined);
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useAudioRecorder());

    expect(result.current.status).toBe('unsupported');
    expect(result.current.message).toMatch(/not available/i);
  });
});
