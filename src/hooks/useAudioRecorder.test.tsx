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

  it('keeps a completed recording in a local replay URL and cleans it up', async () => {
    const stopTrack = vi.fn();
    const stream = {
      getTracks: () => [{ stop: stopTrack }],
    } as unknown as MediaStream;
    const createObjectURL = vi.fn().mockReturnValue('blob:lesson-recording');
    const revokeObjectURL = vi.fn();
    class MediaRecorderStub {
      state: RecordingState = 'inactive';
      mimeType = 'audio/webm';
      ondataavailable: ((event: BlobEvent) => void) | null = null;
      onstop: (() => void) | null = null;

      start() {
        this.state = 'recording';
      }

      stop() {
        this.state = 'inactive';
        this.ondataavailable?.({
          data: new Blob(['audio'], { type: 'audio/webm' }),
        } as BlobEvent);
        this.onstop?.();
      }
    }
    vi.stubGlobal('MediaRecorder', MediaRecorderStub);
    vi.stubGlobal(
      'URL',
      Object.assign(class extends URL {}, {
        createObjectURL,
        revokeObjectURL,
      }),
    );
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: vi.fn().mockResolvedValue(stream) },
    });
    const { result, unmount } = renderHook(() => useAudioRecorder());

    await act(() => result.current.start());
    expect(result.current.status).toBe('recording');

    act(() => result.current.stop());
    expect(result.current.status).toBe('ready');
    expect(result.current.audioUrl).toBe('blob:lesson-recording');
    expect(createObjectURL).toHaveBeenCalledOnce();

    unmount();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:lesson-recording');
    expect(stopTrack).toHaveBeenCalled();
  });
});
