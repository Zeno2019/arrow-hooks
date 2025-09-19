import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useKeyboardEvent from '../index';

describe('useKeyboardEvent', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle keyboard events', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardEvent('keydown', handler));

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalled();
  });

  it('should handle specific key events', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardEvent('keydown', handler, 'Enter'));

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(enterEvent);
    expect(handler).toHaveBeenCalled();

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
