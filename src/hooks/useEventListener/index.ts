import { useEffect, useRef } from 'react';
import { isBrowser } from '../../util';

export type EventMap = WindowEventMap & DocumentEventMap & HTMLElementEventMap;
export type EventType = keyof EventMap;
export type ElementType = Window | Document | HTMLElement;

/**
 * React hook 用于处理类型安全的 DOM 事件
 * @param eventType -要监听的事件类型
 * @param handler -事件处理函数
 * @param element -将事件附加到的元素（默认为窗口）
 * @returns { void } - 无
 */
const useEventListener = <K extends EventType>(eventType: K, handler: (event: EventMap[K]) => void, element: ElementType = window): void => {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported || !isBrowser) return;

    const eventListener = (event: Event) => savedHandler.current(event as EventMap[K]);
    element.addEventListener(eventType, eventListener);

    return () => {
      element.removeEventListener(eventType, eventListener);
    };
  }, [eventType, element]);
};

export default useEventListener;
