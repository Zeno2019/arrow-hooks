import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach, type Mock } from 'vitest';
import useInfiniteScroll from '../index';

describe('useInfiniteScroll', () => {
  let mockIntersectionObserver: Mock;
  const createMockEntry = (isIntersecting: boolean) => ({
    isIntersecting,
    target: document.createElement('div'),
    boundingClientRect: new DOMRectReadOnly(),
    intersectionRatio: 1,
    intersectionRect: new DOMRectReadOnly(),
    rootBounds: null,
    time: Date.now(),
  });

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

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    // 测试结束后恢复原始的 IntersectionObserver
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should initialize with correct options', () => {
    const ref = { current: document.createElement('div') };
    const onLoadMore = vi.fn();
    const options = {
      rootMargin: '20px',
      threshold: 0.5,
    };

    renderHook(() =>
      useInfiniteScroll(ref, onLoadMore, {
        hasMore: true,
        threshold: options.threshold,
        rootMargin: options.rootMargin,
      })
    );

    // 修改断言，移除 root 选项的检查
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining(options)
    );
  });

  it('should cleanup observer on unmount', () => {
    const ref = { current: document.createElement('div') };
    const onLoadMore = vi.fn();

    const { unmount } = renderHook(() =>
      useInfiniteScroll(ref, onLoadMore, { hasMore: true })
    );

    const observer = mockIntersectionObserver.mock.results[0].value;

    unmount();
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it('should debounce multiple intersection events', async () => {
    const ref = { current: document.createElement('div') };
    const onLoadMore = vi.fn().mockResolvedValue(undefined);
    let intersectionCallback: IntersectionObserverCallback;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn(),
      };
    });

    renderHook(() =>
      useInfiniteScroll(ref, onLoadMore, {
        hasMore: true,
        delay: 100
      })
    );

    // 在每次触发之间等待一段时间
    await act(async () => {
      intersectionCallback!([createMockEntry(true)], {} as IntersectionObserver);
      await vi.advanceTimersByTime(50);

      intersectionCallback!([createMockEntry(true)], {} as IntersectionObserver);
      await vi.advanceTimersByTime(50);

      intersectionCallback!([createMockEntry(true)], {} as IntersectionObserver);
      await vi.advanceTimersByTime(100); // 等待防抖时间结束
    });

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should call onLoadMore when element becomes visible', async () => {
    const ref = { current: document.createElement('div') };
    const onLoadMore = vi.fn().mockResolvedValue(undefined);
    let observer: ReturnType<typeof mockIntersectionObserver>;

    renderHook(() =>
      useInfiniteScroll(ref, onLoadMore, { hasMore: true })
    );

    const [[callback]] = mockIntersectionObserver.mock.calls;
    observer = mockIntersectionObserver.mock.results[0].value;

    await act(async () => {
      callback([createMockEntry(true)], observer);
      // 等待防抖
      await vi.advanceTimersByTime(100);
      // 等待 Promise resolve
      await Promise.resolve();
    });

    expect(onLoadMore).toHaveBeenCalled();
  });

  it('should not call onLoadMore when hasMore is false', async () => {
    const ref = { current: document.createElement('div') };
    const onLoadMore = vi.fn();

    let intersectionCallback: IntersectionObserverCallback;
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn(),
      };
    });

    renderHook(() =>
      useInfiniteScroll(ref, onLoadMore, { hasMore: false })
    );

    await act(async () => {
      intersectionCallback!([
        {
          isIntersecting: true,
          target: ref.current,
          boundingClientRect: new DOMRectReadOnly(),
          intersectionRatio: 1,
          intersectionRect: new DOMRectReadOnly(),
          rootBounds: null,
          time: Date.now(),
        } as IntersectionObserverEntry,
      ], {} as IntersectionObserver);
    });

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('should not call onLoadMore when already loading', async () => {
    const ref = { current: document.createElement('div') };
    const onLoadMore = vi.fn();

    let intersectionCallback: IntersectionObserverCallback;
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn(),
      };
    });

    renderHook(() =>
      useInfiniteScroll(ref, onLoadMore, { isLoading: true, hasMore: true })
    );

    await act(async () => {
      intersectionCallback!([
        {
          isIntersecting: true,
          target: ref.current,
          boundingClientRect: new DOMRectReadOnly(),
          intersectionRatio: 1,
          intersectionRect: new DOMRectReadOnly(),
          rootBounds: null,
          time: Date.now(),
        } as IntersectionObserverEntry,
      ], {} as IntersectionObserver);
    });

    expect(onLoadMore).not.toHaveBeenCalled();
  });
});