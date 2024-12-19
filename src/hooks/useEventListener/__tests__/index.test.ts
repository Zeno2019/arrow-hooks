import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import useEventListener from '../index';

describe('useEventListener', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add event listener to window by default', () => {
    const handler = vi.fn();
    renderHook(() => useEventListener('click', handler));

    // 模拟点击事件
    const event = new Event('click');
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should add event listener to specified element', () => {
    const handler = vi.fn();
    const element = document.createElement('div');
    renderHook(() => useEventListener('click', handler, element));

    // 模拟元素点击事件
    const event = new Event('click');
    element.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should remove event listener when unmounted', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useEventListener('click', handler));

    unmount();

    // 模拟点击事件
    const event = new Event('click');
    window.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should update handler without re-adding listener', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const { rerender } = renderHook(({ handler }) => useEventListener('click', handler), { initialProps: { handler: handler1 } });

    // 使用第一个处理函数触发事件
    window.dispatchEvent(new Event('click'));
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();

    // 更新到第二个处理函数
    rerender({ handler: handler2 });

    // 使用更新后的处理函数触发事件
    window.dispatchEvent(new Event('click'));
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('should handle different event types', () => {
    const handler = vi.fn();
    renderHook(() => useEventListener('mousemove', handler));

    // 模拟鼠标移动事件
    const event = new Event('mousemove');
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);
  });
});
