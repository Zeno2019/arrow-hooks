import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import useHover from '../index';

describe('useHover', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should detect hover state', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    const { result } = renderHook(() => useHover(ref));

    expect(result.current).toBe(false);

    // 使用 act 包装鼠标进入事件
    act(() => {
      element.dispatchEvent(new MouseEvent('mouseenter'));
    });
    expect(result.current).toBe(true);

    // 使用 act 包装鼠标离开事件
    act(() => {
      element.dispatchEvent(new MouseEvent('mouseleave'));
    });
    expect(result.current).toBe(false);
  });

  it('should handle null ref', () => {
    const ref = { current: null };
    const { result } = renderHook(() => useHover(ref));

    expect(result.current).toBe(false);
  });

  it('should cleanup event listeners on unmount', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    
    const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');
    const { unmount } = renderHook(() => useHover(ref));

    act(() => {
      unmount();
    });

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseenter', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
  });
});
