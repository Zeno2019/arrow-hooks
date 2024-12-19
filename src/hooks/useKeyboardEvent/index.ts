import { useEffect } from 'react';

type KeyboardEventType = 'keydown' | 'keyup' | 'keypress';

/**
 * React hook for handling keyboard events
 * @param eventType - The type of keyboard event to listen for
 * @param handler - The callback function to handle the event
 * @param targetKey - Optional specific key to listen for
 */
const useKeyboardEvent = (
  eventType: KeyboardEventType,
  handler: (event: KeyboardEvent) => void,
  targetKey?: string
) => {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (targetKey && event.key !== targetKey) {
        return;
      }
      handler(event);
    };

    window.addEventListener(eventType, listener);

    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, handler, targetKey]);
};

export default useKeyboardEvent;
