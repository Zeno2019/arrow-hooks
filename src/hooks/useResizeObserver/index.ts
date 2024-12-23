import { useEffect, useRef } from 'react';
import { isBrowser } from '../../util';

type ResizeCallback = (entry: ResizeObserverEntry) => void;

/**
 * 监听 DOM 元素尺寸变化并执行回调的 Hook
 * @param ref - 要监听的元素引用
 * @param callback - 尺寸变化时的回调函数
 * @param options - ResizeObserver 的配置选项
 */
const useResizeObserver = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: ResizeCallback,
  options?: ResizeObserverOptions
): void => {
  const observerRef = useRef<ResizeObserver>();

  useEffect(() => {
    if (!isBrowser || !ref.current || !window.ResizeObserver) {
      return;
    }

    const element = ref.current;
    observerRef.current = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || !entries.length) {
        return;
      }
      callback(entries[0]);
    });

    observerRef.current.observe(element, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ref, callback, options]);
}

export default useResizeObserver;
