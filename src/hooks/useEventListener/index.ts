import { useEffect, useRef } from 'react';
import { isBrowser } from '../../util';

type EventType = keyof WindowEventMap | keyof DocumentEventMap | keyof HTMLElementEventMap;
type EventElement = Window | Document | HTMLElement | null;

export default function useEventListener<K extends EventType>(eventType: K, callback: (e: Event) => void, element: EventElement = window) {
  // 使用 ref 存储回调函数，避免因回调函数变化而重新添加事件监听
  const callbackRef = useRef(callback);

  // 更新 callbackRef
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isBrowser) return;
    if (element == null) return;

    const handler = (e: Event) => callbackRef.current(e);
    element.addEventListener(eventType, handler);

    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
}
