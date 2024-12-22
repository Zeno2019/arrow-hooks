import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import useIntersectionObserver from '../index';

describe('useIntersectionObserver', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  const mockCallback = vi.fn();

  beforeAll(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    vi.stubGlobal('IntersectionObserver', vi.fn().mockImplementation((callback) => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: vi.fn(),
    })));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize and observe element', () => {
    const ref = { current: document.createElement('div') };
    renderHook(() => useIntersectionObserver(ref, mockCallback));
    expect(mockObserve).toHaveBeenCalledWith(ref.current);
  });

  it('should handle null ref', () => {
    const ref = { current: null };
    renderHook(() => useIntersectionObserver(ref, mockCallback));
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('should cleanup on unmount', () => {
    const ref = { current: document.createElement('div') };
    const { unmount } = renderHook(() => useIntersectionObserver(ref, mockCallback));
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should call callback when intersection changes', () => {
    const ref = { current: document.createElement('div') };
    const mockEntry = {
      isIntersecting: true,
      target: ref.current,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 1,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: 0,
    };

    renderHook(() => useIntersectionObserver(ref, mockCallback));

    const observerCallback = vi.mocked(window.IntersectionObserver).mock.calls[0][0];
    observerCallback([mockEntry], {} as IntersectionObserver);

    expect(mockCallback).toHaveBeenCalledWith([mockEntry], expect.any(Object));
  });

  it('should stop observing when freezeOnceVisible is true and element becomes visible', () => {
    const ref = { current: document.createElement('div') };
    const mockEntry = {
      isIntersecting: true,
      target: ref.current,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 1,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: 0,
    };

    renderHook(() =>
      useIntersectionObserver(ref, mockCallback, { freezeOnceVisible: true })
    );

    const observerCallback = vi.mocked(window.IntersectionObserver).mock.calls[0][0];
    observerCallback([mockEntry], { disconnect: mockDisconnect } as unknown as IntersectionObserver);

    expect(mockDisconnect).toHaveBeenCalled();
  });
});