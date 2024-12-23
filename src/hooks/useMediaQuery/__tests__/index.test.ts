import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useMediaQuery from '../index';

describe('useMediaQuery', () => {
  const originalMatchMedia = window.matchMedia;
  let mediaQueryCallbacks: ((e: MediaQueryListEvent) => void)[] = [];

  const createMatchMedia = (initialMatches: boolean) => 
    vi.fn().mockImplementation((query: string) => ({
      matches: initialMatches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (event: string, callback: (e: MediaQueryListEvent) => void) => {
        mediaQueryCallbacks.push(callback);
      },
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

  beforeEach(() => {
    mediaQueryCallbacks = [];
    // 确保初始状态为 false
    vi.stubGlobal('matchMedia', createMatchMedia(false));
  });

  afterEach(() => {
    vi.stubGlobal('matchMedia', originalMatchMedia);
    vi.clearAllMocks();
  });

  it('should return true for matching media query', () => {
    // 测试匹配状态时使用 true
    vi.stubGlobal('matchMedia', createMatchMedia(true));
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(true);
  });

  it('should update when media query changes', () => {
    // 确保初始状态为 false
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(false);

    // 触发媒体查询变化
    act(() => {
      mediaQueryCallbacks.forEach(callback => 
        callback({ matches: true, media: '(min-width: 1024px)' } as MediaQueryListEvent)
      );
    });

    expect(result.current).toBe(true);
  });

  it('should work with legacy browser API', () => {
    let legacyHandler: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null = null;
    const matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      // 使用旧版 API
      addListener: (handler: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => {
        legacyHandler = handler;
      },
      removeListener: vi.fn(),
      addEventListener: undefined, // 模拟不支持新版 API
      removeEventListener: undefined,
      dispatchEvent: vi.fn(),
    }));

    vi.stubGlobal('matchMedia', matchMedia);

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(false);

    // 使用旧版 API 触发变化
    act(() => {
      if (legacyHandler) {
        legacyHandler.call(
          { matches: true } as MediaQueryList,
          { matches: true } as MediaQueryListEvent
        );
      }
    });

    expect(result.current).toBe(true);
  });
});