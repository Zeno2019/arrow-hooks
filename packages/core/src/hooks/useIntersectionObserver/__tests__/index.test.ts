import { renderHook } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it, type Mock, vi } from 'vitest';
import useIntersectionObserver from '../index';

describe('useIntersectionObserver', () => {
  const mockCallback = vi.fn();
  let mockIntersectionObserver: Mock;

  beforeAll(() => {
    mockIntersectionObserver = vi.fn((callback) => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
      takeRecords: vi.fn(),
    }));

    vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);
  });

  afterAll(() => {
    // 测试结束后恢复原始的 IntersectionObserver
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize and observe element', () => {
    const ref = { current: document.createElement('div') };
    renderHook(() => useIntersectionObserver(ref, mockCallback));

    const observer = mockIntersectionObserver.mock.results[0].value;
    expect(observer.observe).toHaveBeenCalledWith(ref.current);
  });

  it('should handle null ref', () => {
    const ref = { current: null };
    renderHook(() => useIntersectionObserver(ref, mockCallback));

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
  });

  it('should cleanup on unmount', () => {
    const ref = { current: document.createElement('div') };
    const { unmount } = renderHook(() => useIntersectionObserver(ref, mockCallback));

    unmount();
    const observer = mockIntersectionObserver.mock.results[0].value;
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it('should call callback with intersection entries', () => {
    const ref = { current: document.createElement('div') };
    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      target: document.createElement('div'),
      time: Date.now(),
    };
    const mockEntries = [mockEntry];

    renderHook(() => useIntersectionObserver(ref, mockCallback));

    const [[observerCallback]] = mockIntersectionObserver.mock.calls;
    // 传入 mockIntersectionObserver 作为第二个参数
    observerCallback(mockEntries, mockIntersectionObserver);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(mockEntries, mockIntersectionObserver);
  });

  it('should pass options to IntersectionObserver', () => {
    const ref = { current: document.createElement('div') };
    const options = {
      root: document.createElement('div'),
      rootMargin: '10px',
      threshold: 0.5,
    };

    renderHook(() => useIntersectionObserver(ref, mockCallback, options));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), options);
  });
});
