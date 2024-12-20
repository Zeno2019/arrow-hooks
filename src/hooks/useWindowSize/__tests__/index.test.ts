import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useWindowSize from '../index';

describe('useWindowSize', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    vi.useFakeTimers();
    // 设置初始窗口大小
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    // 恢复原始窗口大小
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });

    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should return initial window size', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({
      width: 1024,
      height: 768,
    });
  });

  it('should update on window resize with debounce', async () => {
    const { result } = renderHook(() => useWindowSize(100));

    await act(async () => {
      // 修改窗口大小
      Object.defineProperty(window, 'innerWidth', { value: 1920 });
      Object.defineProperty(window, 'innerHeight', { value: 1080 });
      window.dispatchEvent(new Event('resize'));

      // 等待防抖
      await vi.advanceTimersByTime(100);
    });

    expect(result.current).toEqual({
      width: 1920,
      height: 1080,
    });
  });

  it('should use default delay', () => {
    const timeoutSpy = vi.spyOn(window, 'setTimeout');
    renderHook(() => useWindowSize());

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(timeoutSpy).toHaveBeenCalledWith(expect.any(Function), 200);
  });

  it('should handle multiple rapid resizes', async () => {
    const { result } = renderHook(() => useWindowSize(100));

    await act(async () => {
      // 多次改变窗口大小
      for (let width = 800; width <= 1200; width += 200) {
        Object.defineProperty(window, 'innerWidth', { value: width });
        window.dispatchEvent(new Event('resize'));
        await vi.advanceTimersByTime(50); // 模拟快速调整，时间间隔小于防抖时间
      }

      // 等待最后一次防抖完成
      await vi.advanceTimersByTime(100);
    });

    // 应该只反映最后一次改变
    expect(result.current.width).toBe(1200);
  });

  it('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useWindowSize());

    act(() => {
      unmount();
    });

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });
});
