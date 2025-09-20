import { type RefObject, useCallback, useState } from 'react';
import { debounce } from '../../util';
import useIntersectionObserver from '../useIntersectionObserver';

export interface UseInfiniteScrollOptions extends IntersectionObserverInit {
  hasMore?: boolean;
  isLoading?: boolean; // 是否正在加载中
  delay?: number; // 防抖延迟时间（默认毫秒）
}

/**
 * 无限滚动的 Hook
 * @param targetRef - 要观察的元素引用
 * @param onLoadMore - 加载更多数据的回调函数
 * @param options - 配置选项
 * @returns { boolean } - 是否加载中
 */
const useInfiniteScroll = (
  targetRef: RefObject<Element>,
  onLoadMore: () => Promise<void> | void,
  options: UseInfiniteScrollOptions = {},
): boolean => {
  const {
    threshold = 0.5,
    isLoading = false,
    hasMore = true,
    rootMargin = '0px',
    delay = 100,
  } = options;

  const [loading, setLoading] = useState(isLoading);

  const handleIntersect = useCallback(
    debounce(async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry?.isIntersecting && !loading && hasMore) {
        setLoading(true);

        try {
          await onLoadMore();
        } finally {
          setLoading(false);
        }
      }
    }, delay),

    [loading, hasMore, onLoadMore],
  );

  useIntersectionObserver(targetRef, handleIntersect, {
    threshold,
    rootMargin,
  });

  return loading;
};

export default useInfiniteScroll;
