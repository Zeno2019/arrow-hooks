import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import useKeyboardEvent from '../hooks/useKeyboardEvent';

describe('useKeyboardEvent', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle keyboard events', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardEvent('keydown', handler));

    // 模拟键盘事件
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalled();
  });

  it('should handle specific key events', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardEvent('keydown', handler, 'Enter'));

    // 应该调用处理函数（按下 Enter 键）
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(enterEvent);
    expect(handler).toHaveBeenCalled();

    // 不应该调用处理函数（按下其他键）
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(escapeEvent);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should cleanup event listener', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useKeyboardEvent('keydown', handler));

    unmount();

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  });
});
