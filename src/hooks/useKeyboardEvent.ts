import { useEffect } from 'react';

type KeyboardEventType = 'keydown' | 'keyup' | 'keypress';
type KeyboardEventHandler = (event: KeyboardEvent) => void;

/**
 * React hook for handling keyboard events
 * @param eventType - The type of keyboard event to listen for
 * @param handler - The callback function to handle the keyboard event
 * @param targetKey - Optional specific key to listen for
 */
const useKeyboardEvent = (
  eventType: KeyboardEventType,
  handler: KeyboardEventHandler,
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
