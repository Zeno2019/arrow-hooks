import useEventListener from '../useEventListener';

type KeyboardEventType = 'keydown' | 'keyup' | 'keypress';

/**
 * 用于处理键盘事件的 React hook
 * @param eventType -要监听的键盘事件类型（'keydown'、'keyup' 或 'keypress'）
 * @param handler -处理键盘事件的回调函数
 * @param targetKey -可选的特定按键来监听
 * @returns {void} - 无
 */
const useKeyboardEvent = (
  eventType: KeyboardEventType,
  handler: (event: KeyboardEvent) => void,
  targetKey?: string,
): void => {
  useEventListener(eventType, ((e: KeyboardEvent) => {
    if (targetKey && e.key !== targetKey) {
      return;
    }

    handler(e);
  }) as EventListener);
};

export default useKeyboardEvent;
