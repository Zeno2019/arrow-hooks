import { type RefObject, useEffect } from 'react';

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean; // 是否在元素首次进入视口时就停止观察
}

/**
 * 监听元素的可见性变化, 当元素进入或离开视口时执行回调
 * @param elementRef 要观察的元素的 ref
 * @param callback 元素是否可见时，调用的回调函数
 * @param options IntersectionObserver 配置项
 * @returns { void } 无
 */
const useIntersectionObserver = (
  elementRef: RefObject<Element>,
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {},
): void => {
  const {
    freezeOnceVisible = false, // 如果设置了 freezeOnceVisible 且元素已经可见，则停止观察
    ...observerOptions
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !window.IntersectionObserver) {
      return;
    }

    let isFrozen = false;
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      callback(entries, observer);

      if (freezeOnceVisible && entries.some((entry) => entry.isIntersecting)) {
        isFrozen = true;
        observer.disconnect();
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(element);

    return () => {
      if (!isFrozen) {
        observer.disconnect();
      }
    };
  }, [elementRef, callback, freezeOnceVisible, ...Object.values(observerOptions)]);
};

export default useIntersectionObserver;
