import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterEach, type Mock } from 'vitest';
import useResizeObserver from '../index';

describe('useResizeObserver', () => {
  const mockCallback = vi.fn();
  let mockResizeObserver: Mock;

  beforeAll(() => {
    mockResizeObserver = vi.fn((callback) => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    }));

    // 在 vitest 环境中设置 mock
    window.ResizeObserver = mockResizeObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize and observe element', () => {
    const ref = { current: document.createElement('div') };
    renderHook(() => useResizeObserver(ref, mockCallback));

    const observer = mockResizeObserver.mock.results[0].value;
    expect(observer.observe).toHaveBeenCalledWith(ref.current, undefined);
  });

  it('should handle null ref', () => {
    const ref = { current: null };
    renderHook(() => useResizeObserver(ref, mockCallback));

    expect(mockResizeObserver).not.toHaveBeenCalled();
  });

  it('should cleanup on unmount', () => {
    const ref = { current: document.createElement('div') };
    const { unmount } = renderHook(() => useResizeObserver(ref, mockCallback));

    unmount();
    const observer = mockResizeObserver.mock.results[0].value;
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it('should call callback when size changes', () => {
    const ref = { current: document.createElement('div') };
    const mockEntry = {
      contentRect: { width: 100, height: 100 },
    };

    renderHook(() => useResizeObserver(ref, mockCallback));

    // 直接获取并调用回调函数
    const [[observerCallback]] = mockResizeObserver.mock.calls;
    observerCallback([mockEntry]);

    expect(mockCallback).toHaveBeenCalledWith(mockEntry);
  });
});
